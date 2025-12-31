import { NgModule } from '@angular/core';
import { GraphQLModule } from './audit/graphql.module';

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarController,
  PieController
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarController,
  PieController
);

@NgModule({
  imports: [
    // ... autres imports
    GraphQLModule
  ],
  // ...
})
export class AppModule { }
