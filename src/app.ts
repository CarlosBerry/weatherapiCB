import * as express from 'express';
import * as logger from 'morgan';
import * as cors from 'cors';
import * as path from 'path';
import * as hbs from 'hbs';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import { WeatherController } from './controllers/weather.controller';

@injectable()
export class Application {

    private readonly _internalError: number = 500;
    private readonly _viewsDir: string = path.join(__dirname, '..', 'templates', 'views');
    private readonly _partialsDir: string = path.join(__dirname, '..', 'templates', 'partials');
    public app: express.Application;

    public constructor(@inject(TYPES.WeatherController) private _weatherController: WeatherController) {

        this.app = express();

        this.config();

        this.bindRoutes();
    }

    private config(): void {
        //Configuration de Handlebars
        this.app.set('view engine', 'hbs');
        this.app.set('views', this._viewsDir);
        hbs.registerPartials(this._partialsDir);

        // Configuration des middlewares pour toutes les requêtes
        this.app.use(logger('dev'));
        this.app.use(express.json());//prend le body pour le convertir en json-1
        this.app.use(cors());
        
        //Configuration du dossier public
        this.app.use(express.static(path.join(__dirname, '../public')));
       
    }

    public bindRoutes(): void {
     
        this.app.get('/', (req, res) => {
            res.redirect('/weather');
        });
        
        
        this.app.use('/weather', this._weatherController.router);


        this.app.use('/astronomy', this._weatherController.router);


        this.errorHandeling();
    }

    private errorHandeling(): void {
        // Gestion des erreurs
      
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const err: Error = new Error('Not Found');
            next(err);
        });

        // Error handler en pour l'environnement de développement
        // Imprime le stacktrace
        if (this.app.get('env') === 'development') {
            this.app.use((err: any, req: express.Request, res: express.Response) => {
                res.status(err.status || this._internalError);
                res.send({
                    message: err.message,
                    error: err,
                });
            });
        }

        this.app.use((err: any, req: express.Request, res: express.Response) => {
            res.status(err.status || this._internalError);
            res.send({
                message: err.message,
                error: {},
            });
        });
    }
}