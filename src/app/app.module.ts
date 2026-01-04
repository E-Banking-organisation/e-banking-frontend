import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule } from 'apollo-angular';
import { GraphQLModule } from './audit/graphql.module';

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarController,
  PieController,
  LineController,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarController,
  PieController,
  LineController,
  Filler
);

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    ApolloModule,
    GraphQLModule
  ],
})
export class AppModule { }