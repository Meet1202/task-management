import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public currentRoute = '';

  constructor(
    public router: Router,
    public changeDetection: ChangeDetectorRef
  ) {
    console.log(this.router.url);
  }
  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.currentRoute = this.router.url;
        this.changeDetection.detectChanges();
        console.log('Route changed to:', typeof this.currentRoute);
      });
  }

  redirect() {
    this.router.navigate(['/add-task']);
  }

}
