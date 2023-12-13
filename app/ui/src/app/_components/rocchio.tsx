import {FlaskResponse} from "~/server/api/routers/universities";

const fs = require('fs');

function rocchioAlgorithm(invertedFile: Record<string, number>, results: FlaskResponse, currentQuery: string) {
        const query = {};
        const weights: Record<string, number> = {};

        // Get all documents/results marked as relevant.
        const relevantDocs = results.results.filter(t => t.isRelevant);
        // Get all documents/results marked as non-relevant.
        const nonRelevantDocs = results.results.filter(t => !t.isRelevant);

        // Initialize each term's weight.
        for (const term in invertedFile) {
            weights[term] = 0.0;
        }

        // Holds the weight for each token related to its influence in relevant results.
        const relevantDocsTFWeights: Record<string, number> = {};
        // Holds the weight for each token related to its influence in non-relevant results.
        const nonRelevantDocsTFWeights: Record<string, number> = {};

        // Counts the frequency of each term that occurs in a relevant document.
        relevantDocs?.forEach(document => {
            document.university_vector?.forEach(t => {
                for (const term in t) {
                    relevantDocsTFWeights[term.key] = (relevantDocsTFWeights[term.key] || 0) + term.value;
                }
            });
        });

        // Counts the frequency of each term that occurs in a non-relevant document.
        nonRelevantDocs?.forEach(document => {
            document.university_vector?.forEach(t => {
                for (const term in t) {
                    nonRelevantDocsTFWeights[term.key] = (nonRelevantDocsTFWeights[term.key] || 0) + term.value;
                }
            });
        });

        // For each term in the Inverted Matrix.
        for (const term in invertedFile) {
            docsResults?.forEach(result => {
                invertedFile[term]?.forEach(t => {
                    // Computes idf (inverted document frequency) for a term.
                    // idf = log(N / df_t) where:
                    // N - number of total documents.
                    // df_t - document frequency for term t.
                    const idf = Math.log10(docsResults.length / Object.keys(t).length);

                    // For each entry (term) in the Inverted Matrix,
                    // Computes its weight according to the Rocchio Algorithm formula.
                    for (const dictionaryKey in t) {
                        const y = docsResults.findIndex(result => (result.play_id?.[0] || -1) === Number(dictionaryKey));
                        if (y !== -1) {
                            const x1 = weights[term] || 0;
                            let x2 = 0.0;
                            const x3 = idf;
                            let x4 = 0.0;
                            const x5 = relevantDocs?.length || 0;

                            if (docsResults[y].isRelevant) {
                                x2 = Constants.rewardForRelevantOccurrence;
                                x4 = relevantDocsTFWeights[term] || 0;
                            } else {
                                x2 = Constants.penalizationForNonRelevantOccurrence;
                                x4 = nonRelevantDocsTFWeights[term] || 0;
                            }

                            // Rocchio Algorithm formula.
                            weights[term] = x1 + x2 * x3 * (x4 / x5);
                        }
                    }

                    // Update the term weight in the vector model.
                    if (query[term]) {
                        query[term] = 0 * (query[term] || 0) + (weights[term] || 0);
                    } else {
                        query[term] = weights[term] || 0;
                    }
                });
            });

            // For logging purposes, stores each pair of term-weight in a file.
            fs.writeFileSync('./rocchioResults.txt', '');

            for (const term in query) {
                fs.appendFileSync('./rocchioResults.txt', '===========\n' + term + '\n' + query[term] + '\n');
            }
        }

        return query;
    }

    function computeImmediateNeighborhoodFrequency(results: { key?: string; response?: any; }, invertedFile: { [x: string]: any[]; key?: string; }, query: string) {
        const tokensArr = query.split(/\s+|\?|!|\.|]|\[|}|\{|'s|,|-|\)|\(|'s|-/);

        const immediateNeighborhoodFrequency = {};

        // Loop through all dictionary values (terms) in the inverted matrix.
        for (const key in invertedFile) {
            invertedFile[key]?.forEach((t, playID) => {
                const document = results.response?.docs?.find(t => (t.play_id?.[0] || -1) === playID);
                const resultStr = (document?.play || '') + (document?.next_play || '');

                const tokens = resultStr.split(/\s+|\?|!|\.|]|\[|}|\{|'s|,|-|\)|\(|'s|-/);

                t.forEach(position => {
                    // If the term in the immediate next position belongs to the query,
                    // increment the Immediate Neighborhood Frequency.
                    if (position + 1 < tokensArr.length) {
                        if (tokensArr.includes(tokens[position + 1])) {
                            immediateNeighborhoodFrequency[key] = (immediateNeighborhoodFrequency[key] || 0) + 1;
                        }
                    }

                    // If the term in the immediate previous position belongs to the query,
                    // increment the Immediate Neighborhood Frequency.
                    if (position - 1 >= 0 && tokensArr.includes(tokens[position - 1])) {
                        immediateNeighborhoodFrequency[key] = (immediateNeighborhoodFrequency[key] || 0) + 1;
                    }
                });
            });
        }

        return immediateNeighborhoodFrequency;
    }

// Constants object, replace with your actual Constants
const Constants = {
    rewardForRelevantOccurrence: 1.0,
    penalizationForNonRelevantOccurrence: -1.0,
    weightRewardImmediateNeighborhood: 0.5 // Adjust the weight as needed
};

// Usage example
const invertedFile = {}; // Replace with your actual data
const results = {}; // Replace with your actual data
const currentQuery = 'your query here'; // Replace with your actual query
const immediateNeighborhoodFrequency = computeImmediateNeighborhoodFrequency(results, invertedFile, currentQuery);
const expandedQuery = rocchioAlgorithm(invertedFile, results, immediateNeighborhoodFrequency);
console.log('Expanded Query:', expandedQuery);
