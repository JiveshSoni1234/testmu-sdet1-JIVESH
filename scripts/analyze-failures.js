import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import {
    explainTestFailure,
    saveLLMReport,
} from '../llm_integration/failureExplainer.js';

const RESULTS_FILE = path.join('reports', 'results.json');

function getFailureContext(result) {
    if (!result.attachments) return { url: '', pageHTML: '' };

    const attachment = result.attachments.find(
        (a) => a.name === 'failure-context'
    );
    if (!attachment) return { url: '', pageHTML: '' };

    try {
        if (attachment.body) {
            const parsed = JSON.parse(
                Buffer.from(attachment.body, 'base64').toString('utf8')
            );
            return { url: parsed.url || '', pageHTML: parsed.html || '' };
        }
        if (attachment.path && fs.existsSync(attachment.path)) {
            const parsed = JSON.parse(fs.readFileSync(attachment.path, 'utf8'));
            return { url: parsed.url || '', pageHTML: parsed.html || '' };
        }
    } catch {
        // fall through to empty
    }
    return { url: '', pageHTML: '' };
}

async function analyzeFailures() {
    if (!fs.existsSync(RESULTS_FILE)) {
        console.error('❌ reports/results.json not found.');
        console.log('Run Playwright first: npm test');
        process.exit(1);
    }

    const report = JSON.parse(
        fs.readFileSync(RESULTS_FILE, 'utf8')
    );

    const analyses = [];

    console.log('\n🤖 Reading Playwright JSON Report...\n');

    async function processSuite(suite) {
        if (!suite) return;

        if (suite.suites && suite.suites.length > 0) {
            for (const child of suite.suites) {
                await processSuite(child);
            }
        }

        if (!suite.specs) return;

        for (const spec of suite.specs) {

            if (!spec.tests) continue;

            for (const test of spec.tests) {

                if (!test.results) continue;

                for (const result of test.results) {

                    if (
                        result.status === 'passed' ||
                        result.status === 'skipped'
                    ) {
                        continue;
                    }

                    let errorMessage = 'Unknown Error';

                    if (result.error?.message) {
                        errorMessage = result.error.message;
                    }
                    else if (
                        result.errors &&
                        result.errors.length > 0
                    ) {
                        errorMessage = result.errors
                            .map(e => e.message)
                            .join('\n');
                    }

                    console.log(
                        `🔍 ${spec.title} (${result.status})`
                    );

                    const { url, pageHTML } = getFailureContext(result);

                    const analysis =
                        await explainTestFailure({
                            testName: spec.title,
                            errorMessage,
                            url,
                            pageHTML,
                        });

                    analyses.push(analysis);
                }
            }
        }
    }

    if (report.suites) {
        for (const suite of report.suites) {
            await processSuite(suite);
        }
    }
    console.log('\n=======================================');
    console.log(`📊 Total AI Analyses Generated: ${analyses.length}`);
    console.log('=======================================\n');

    if (analyses.length === 0) {
        console.log('✅ No failed tests found.');
        return;
    }

    const reportPath = saveLLMReport(analyses);

    console.log('\n=======================================');
    console.log(`✅ Total Failed Tests Analyzed: ${analyses.length}`);
    console.log(`📄 AI Report Saved: ${reportPath}`);
    console.log('=======================================\n');

    console.log('\n================ AI SUMMARY ================\n');

    analyses.forEach((item, index) => {
        console.log(`${index + 1}. ${item.testName}`);
        console.log(`Severity   : ${item.severity}`);
        console.log(`Confidence : ${item.confidence}`);
        console.log(`Root Cause : ${item.rootCause}`);
        console.log('-------------------------------------------');
    });

    console.log('\n===========================================\n');
}

analyzeFailures()
    .then(() => {
        console.log('🎉 AI Failure Analysis Completed.');
    })
    .catch((err) => {
        console.error('\n❌ Analysis failed');
        console.error(err);
        process.exit(1);
    });