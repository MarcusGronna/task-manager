import { Component, ViewChild, inject, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexResponsive,
  ApexNonAxisChartSeries,
} from 'ng-apexcharts';
import { NgApexchartsModule, ChartComponent } from 'ng-apexcharts';
import { combineLatest, map, Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';

import { ProjectService } from '../../../services/project.service';
import { TaskService } from '../../../services/task.service';

export type BarOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
};

export type DonutOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  responsive: ApexResponsive[];
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgApexchartsModule, AsyncPipe, NgIf],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private projSrv = inject(ProjectService);
  private taskSrv = inject(TaskService);

  /** Options exponeras som Observables för reaktiv uppdatering */
  bar$!: Observable<BarOptions>;
  donut$!: Observable<DonutOptions>;

  ngOnInit() {
    /* Tasks per projekt (bar) */
    this.bar$ = combineLatest([
      this.projSrv.projects$,
      this.taskSrv.tasks$,
    ]).pipe(
      map(([projects, tasks]) => {
        const counts = projects.map(
          (p) => tasks.filter((t) => t.projectId === p.id).length
        );

        return {
          series: [{ name: 'Tasks', data: counts }],
          chart: { type: 'bar', height: 350 },
          xaxis: { categories: projects.map((p) => p.name) },
          dataLabels: { enabled: false },
          title: { text: 'Tasks per project' },
        } as BarOptions;
      })
    );

    /* Prio‐fördelning (donut) */
    this.donut$ = this.taskSrv.tasks$.pipe(
      map((list) => {
        const prio = { high: 0, medium: 0, low: 0 };
        list.forEach((t) => prio[t.priority as keyof typeof prio]++);
        return {
          series: [prio.high, prio.medium, prio.low],
          labels: ['High', 'Medium', 'Low'],
          chart: { type: 'donut', height: 350 },
          responsive: [{ breakpoint: 600, options: { chart: { width: 280 } } }],
        } as DonutOptions;
      })
    );
  }
}
