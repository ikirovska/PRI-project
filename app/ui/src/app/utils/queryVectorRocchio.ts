// Helper function for Rocchio update
export const updateQueryVectorRocchio = (queryVector: any[], relevantDocs: any[], nonRelevantDocs: any[], alpha: number, beta: number, gamma: number) => {
    const relevantSum = relevantDocs.reduce((sum, doc) => sum.map((value: number, index: string | number) => value + beta * doc.vector[index]), Array(queryVector.length).fill(0));
    const nonRelevantSum = nonRelevantDocs.reduce((sum, doc) => sum.map((value: number, index: string | number) => value + gamma * doc.vector[index]), Array(queryVector.length).fill(0));

    const updatedQueryVector = queryVector.map((value, index) => alpha * value + relevantSum[index] - nonRelevantSum[index]);

    return updatedQueryVector;
};
