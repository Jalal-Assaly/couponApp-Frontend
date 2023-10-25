import { Component, OnInit } from '@angular/core';
import { Coupon } from './services/coupon';
import { CouponService } from './services/coupon.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'couponApp';

  public coupons!: Coupon[];
  public currentSortColumn: string | null = null; // Track the currently sorted column
  public isSortAscending: boolean = true;         // Track sorting direction

  constructor(private couponService: CouponService) { }

  ngOnInit(): void {
      this.getAllCoupons();
  }

  public getAllCoupons(): void {
    this.couponService.getAllCoupons().subscribe({
      next: (response: Coupon[]) => {
        this.coupons = response;
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  // Function to handle column sorting
  public sort(column: string): void {
    // If the same column is clicked, reverse the sorting direction
    if (this.currentSortColumn === column) {
      this.isSortAscending = !this.isSortAscending;
    } else {
      // If a different column is clicked, reset sorting direction
      this.currentSortColumn = column;
      this.isSortAscending = true;
    }

    // Perform sorting based on the selected column
    this.coupons.sort((a, b) => {
      const valueA = (a as any)[column];
      const valueB = (b as any)[column];
      if (valueA < valueB) {
        return this.isSortAscending ? -1 : 1;
      } else if (valueA > valueB) {
        return this.isSortAscending ? 1 : -1;
      }
      return 0;
    });
  }
}
