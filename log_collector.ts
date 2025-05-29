const BASE_URL: string = 'https://apiendpoint/api/logs';

interface Log {
	"timestampt": string;
	"message": string;
}

interface ApiResponseData {
	"totalLogs": number;
	"count": number;
	"limit": number;
	"logs": Log[];
}