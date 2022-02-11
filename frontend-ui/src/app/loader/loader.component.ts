import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit, OnDestroy {
  public loading: boolean = true;
  constructor(private loaderService: LoaderService) { 
    this.loaderService.isLoading.subscribe((value)=>{
      this.loading = value;
    })
  }
  ngOnInit() {
    this.loading = false;
  }
  ngOnDestroy() {
    this.loaderService.isLoading.unsubscribe();
  }
}
