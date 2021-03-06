import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public feeds: Array<string>;
  private url: string = "https://www.reddit.com/new.json";
  private olderPosts: string = "https://www.reddit.com/new.json?after="

  constructor(public navCtrl: NavController, public http: Http, public loadingCtrl: LoadingController) {
  		this.fetchData();  		
  }


  fetchData():void  {
  	let loading = this.loadingCtrl.create({
  		content: 'Buscando os dados'
  	});

  	loading.present();

  	this.http.get(this.url).map(res => res.json())
  				.subscribe(data => {
  					this.feeds = data.data.children;

  					loading.dismiss();
            this.feeds.forEach((item, i, a) => {              
              if(!item['data']['thumbnail'] 
                  || item['data']['thumbnail'].endsWith('png') !== 1  
                  || item['data']['thumbnail'].indexOf('b.thumbs.redditmedia.com') !== 1  
                  )   
              {
                console.log('entrou em ' + i);  
                  item['data']['thumbnail'] = 'http://www.redditstatic.com/icon.png';
              }                     
            });
            console.log(this.feeds);
  				});


  }

  itemSelecionado(url: string): void {
  	new InAppBrowser(url, "_system");
  }

  doInfinite(infiniteScroll){
      let paramUrl = (this.feeds.length > 0) ? this.feeds[this.feeds.length - 1]['data']['name ']: "";
      this.http.get(this.olderPosts + paramUrl)
          .map(res => res.json())
          .subscribe(data => {
              this.feeds = this.feeds.concat(data.data.children);
               this.feeds.forEach((item, i, a) => {              
              if(!item['data']['thumbnail'] 
                  || item['data']['thumbnail'].endsWith('png') !== 1  
                  || item['data']['thumbnail'].indexOf('b.thumbs.redditmedia.com') !== 1  
                  )   
              {
                console.log('entrou em ' + i);  
                  item['data']['thumbnail'] = 'http://www.redditstatic.com/icon.png';
              }                     
            });
               infiniteScroll.complete();
          }); 
  }
}
