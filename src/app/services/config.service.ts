export class ConfigService {
  public static addBaseAddress(endpoint: string): string {
    return 'https://ezha-by-app.herokuapp.com/' + endpoint;
  }
}
