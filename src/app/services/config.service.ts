import { environment } from "src/environments/environment";

export class ConfigService {
    public static addBaseAddress(endpoint: string): string {
        return environment.apiBaseUri + endpoint;
    }
}