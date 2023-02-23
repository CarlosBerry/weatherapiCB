import { WeatherProvider, WttrObject } from '../interfaces';
import { injectable } from 'inversify';
//import fetch from 'node-fetch';//cm
import fetch, {Response} from 'node-fetch';


@injectable()

export class wttrWeatherService implements WeatherProvider{
    constructor(){
        //empty
    }
    
    async readWeather(location: string): Promise<WttrObject> {
        //const response: Response = await fetch (' https://wttr.in/montreal?format=j1');//le lien de weather
        const response: Response = await fetch (`https://wttr.in/${location}?format=j1`)
        const wttrInfo: any = await response.json();
        console.log(location);
        return wttrInfo;
    }  
    
}