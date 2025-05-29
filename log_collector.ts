const BASE_URL: string = 'https://apiendpoint/api/logs';
const LAST_DAYS_TO_COLLECT_LOGS: number = 7;


// Object to store log data
interface Log {
	"timestampt": string;
	"message": string;
}


// Object to store response data.
interface ApiResponseData {
	"totalLogs": number;
	"count": number;
	"limit": number;
	"logs": Log[];
}

async function fetchResponseData(startTime: Date, endTime: Date): Promise<ApiResponseData> {
	const apiEndTime: string = endTime.toISOString();
	const apiStartTime: string = startTime.toISOString();

	const url: string = `${ BASE_URL }?startTime=${ apiStartTime }&endTime=${ apiEndTime }`;

	const response: Response = await fetch(url);
	if (!response.ok)
		throw new Error(`Failed to fetch response! HTTP status: ${ response.status }`);
	return response.json() as Promise<ApiResponseData>;
}

function getMidtime(startTime: Date, endTime: Date): Date {
	// Converts time to timestamp (e.g, 1672531200000)
	const startTimestamp: number = startTime.getTime();
	const endTimestamp: number = endTime.getTime();

	const midTimestamp: number = (startTimestamp + (endTimestamp - startTimestamp) / 2);

	const midTime = new Date(midTimestamp);

	return midTime;
}

async function collectLogsRecursively(
	startTime: Date,
	endTime: Date,
	initialFetch?: ApiResponseData): Promise<Log[]> {
	if (startTime > endTime) {
		console.log('start time cannot be earlier than the end time.');
		return [];
	}
	const currentData: ApiResponseData = initialFetch ? initialFetch : await fetchResponseData(startTime, endTime);

	if (currentData.count === currentData.totalLogs) {
		console.log(`In time range ${ startTime } - ${ endTime }, ${ currentData.count } logs fetched.`);
		return currentData.logs;
	} else if (startTime
}

async function main() {
	try {
		let logs: Log[] = [];

		const endTime: Date = new Date();
		const startTime: Date = new Date();
		startTime.setUTCDate(endTime.getUTCDate() - LAST_DAYS_TO_COLLECT_LOGS);

		const initialFetch: ApiResponseData = await fetchResponseData(startTime, endTime);
		const totalLogs: number = initialFetch.totalLogs;
		const limitPerCall: number = initialFetch.limit;

		if (totalLogs === 0)
			console.log('Fetching completed. No data found');
		else if (totalLogs <= limitPerCall) {
			logs = initialFetch.logs;
		} else if (totalLogs > limitPerCall) {
			logs = await collectLogsRecursively(startTime, endTime, initialFetch);
		}

	} catch (error) {
		console.error(`Error occured! ${ error }`);
	}

}