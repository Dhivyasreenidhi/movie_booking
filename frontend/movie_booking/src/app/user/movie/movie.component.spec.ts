import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { AppComponent } from '../../app.component';
import { MovieComponent } from './movie.component';
import { HeadersComponent } from '../headers/headers.component';

@NgModule({
  declarations: [
    AppComponent,
    MovieComponent,
    HeadersComponent
  ],
  imports: [
    BrowserModule,
    CommonModule // Add CommonModule here
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }