import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewsfeedRoutingModule } from './newsfeed-routing.module';
import { NewsfeedComponent } from './components/newsfeed.component';

@NgModule({
  declarations: [NewsfeedComponent],
  imports: [
    CommonModule,
    NewsfeedRoutingModule
  ]
})
export class NewsfeedModule { }
