export async function analyzeBeforeUpload(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    const res = await fetch('/api/visionanalyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Image: base64 }),
    });

    const result = await res.json();
    console.log(result);

    if (
        result.hasWatermark ||
        result.likelyDownloaded ||
        !result.isRealProperty
    ) {
        throw result; // throw the full analysis result for context
    }

    return result;
}
