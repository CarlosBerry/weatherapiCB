import { Router, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { WeatherProvider, WttrObject } from '../interfaces';
import { TYPES } from '../types';

@injectable()
export class WeatherController{
    
    
    public constructor(@inject(TYPES.WeatherService) private _weatherService: WeatherProvider,
                                                     private _defaultLocation = 'Montreal'){ /* empty */}

    public get router() : Router {
       
        const router: Router = Router();
               
     
               
        router.get('/now',async (req:Request, res: Response) => {
            const ville:any = req.query.recherche ? req.query.recherche : this._defaultLocation;
            const wttrInfo: WttrObject = await this._weatherService.readWeather(ville);
            console.log(ville);
            const date = new Date();
            res.render('now',{wttrInfo: wttrInfo,'date':date.toString(), 'ville':ville});
        });
        router.get('/hourly',async (req:Request, res: Response) => {
            const ville:any = req.query.recherche ? req.query.recherche : this._defaultLocation;
            const wttrInfo: WttrObject = await this._weatherService.readWeather(ville);
            const date = new Date();
            res.render('hourly',{wttrInfo: wttrInfo,'date':date.toString(), 'ville':ville});
            console.log('wttrInfo');
        });
        router.get('/',async (req:Request, res: Response) => {
            res.redirect('/weather/now');
            console.log('wttrInfo');
        });
          

        return router;
    }
            
    
}