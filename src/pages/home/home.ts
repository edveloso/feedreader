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
  private olderPosts: string = "https://www.reddit.com/new.json?after=";
  private afterParam: string = "";  
  private newerPosts: string = "https://www.reddit.com/new.json?before=";

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
            this.afterParam = data.data.after;

  					loading.dismiss();
            this.feeds.forEach((item, i, a) => {              
              if(!item['data']['thumbnail']                   
                  || item['data']['thumbnail'].indexOf('b.thumbs.redditmedia.com') !== 1  
                  )   
              {
                
                  item['data']['thumbnail'] = 'http://www.redditstatic.com/icon.png';
              }                     
            });

  				});


  }

  itemSelecionado(url: string): void {
  	new InAppBrowser(url, "_system");
  }

  doInfinite(infiniteScroll){      
      this.http.get(this.olderPosts + this.afterParam)
          .map(res => res.json())
          .subscribe(data => {
              this.feeds = this.feeds.concat(data.data.children);
              this.afterParam = data.data.after;
               this.feeds.forEach((item, i, a) => {              
              if(!item['data']['thumbnail']                   
                  || item['data']['thumbnail'].indexOf('b.thumbs.redditmedia.com') !== 1  
                  )   
              {
                
                  item['data']['thumbnail'] = 'http://www.redditstatic.com/icon.png';
              }                     
            });

               infiniteScroll.complete();
          }); 
  }

doRefresh(refresher) {
  console.log(refresher);
    let paramsUrl = this.feeds[0]['data']['name'];

    this.http.get(this.newerPosts + paramsUrl).map(res => res.json())
      .subscribe(data => {
      
        this.feeds = data.data.children.concat(this.feeds);
        
          this.feeds.forEach((item, i, a) => {              
              if(!item['data']['thumbnail']                   
                  || item['data']['thumbnail'].indexOf('b.thumbs.redditmedia.com') !== 1  
                  )   
              {
                
                  item['data']['thumbnail'] = 'http://www.redditstatic.com/icon.png';
              }                     
            })
        refresher.complete();
      });
  } 

}
