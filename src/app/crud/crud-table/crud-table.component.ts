import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { forkJoin } from 'rxjs';
import { Coupon } from 'src/app/services/coupon';
import { CouponService } from 'src/app/services/coupon.service';

@Component({
  selector: 'crud-table',
  templateUrl: './crud-table.component.html',
  styleUrls: ['./crud-table.component.css'],
  providers: [MessageService]
})
export class CrudTableComponent {
  
  couponDialog: boolean = false;

  deleteCouponDialog: boolean = false;

  deleteCouponsDialog: boolean = false;

  coupons: Coupon[] = [];

  coupon: Coupon = {};

  selectedCoupons: Coupon[] = [];

  submitted: boolean = false;

  cols: any[] = [];

  couponTypes: any[] = [];

  rowsPerPageOptions = [5, 10, 20];

  constructor(private couponService: CouponService, private messageService: MessageService) { }

  ngOnInit() {
      this.couponService.getAllCoupons().subscribe({
        next: (response: Coupon[]) => {
          this.coupons = response;
        },
        error: (error: HttpErrorResponse) => {
          alert(error.message);
        }
      });

      this.cols = [
          { field: 'id', header: 'ID'},
          { field: 'code', header: 'Code' },
          { field: 'maxUsages', header: 'Maximum Usages' },
          { field: 'type', header: 'Type' },
          { field: 'discount', header: 'Discount' },
          { field: 'expiryDate', header: 'Expiry Date' }
      ];

      this.couponTypes = [
          { label: 'Fixed', value: 'fixed' },
          { label: 'Percentage', value: 'percentage' }
      ];
  }

  openNew() {
      this.coupon = {};
      this.submitted = false;
      this.couponDialog = true;
  }

  deleteSelectedCoupons() {
      this.deleteCouponsDialog = true;
  }

  editCoupon(coupon: Coupon) {
      this.coupon = { ...coupon };
      this.couponDialog = true;
  }

  deleteCoupon(coupon: Coupon) {
      this.deleteCouponDialog = true;
      this.coupon = { ...coupon };
  }

  confirmDeleteSelected() {
    this.deleteCouponsDialog = false;

    // An array to store the observables for each delete operation
    const deleteObservables = [];

    // Iterate through the selected coupons and call deleteCoupon for each
    for (const selectedCoupon of this.selectedCoupons) {
      const deleteObservable = this.couponService.deleteCoupon(selectedCoupon.id!);
      deleteObservables.push(deleteObservable);
    }

    // Wait delete operations to complete
    forkJoin(deleteObservables).subscribe({
        next: () => {
        this.coupons = this.coupons.filter(val => !this.selectedCoupons.includes(val));
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Coupons Deleted',
          life: 3000
        });
        this.selectedCoupons = [];
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete coupons',
          life: 3000
        });
      }
    });
  }

  confirmDelete() {
      this.deleteCouponDialog = false;
      this.coupons = this.coupons.filter(val => val.id !== this.coupon.id);
      this.couponService.deleteCoupon(this.coupon.id!);
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Coupon Deleted', life: 3000 });
      this.coupon = {};
  }

  hideDialog() {
      this.couponDialog = false;
      this.submitted = false;
  }

  saveCoupon() {
    this.submitted = true;
  
    if (this.coupon.code?.trim()) {
      if (this.coupon.id) {
        if (this.coupon.type === 'fixed') {
          this.couponService.updateFixedCoupon(this.coupon.id, this.coupon).subscribe({
            next: () => { 
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Coupon Updated', life: 3000 });
            this.coupons[this.findIndexById(this.coupon.id!)] = this.coupon;},
            error: (error: HttpErrorResponse) => {
            this.messageService.add({ severity: 'error', summary: "Failed", detail: `${error.error.message}`, life: 3000 });
            }
          });
        } else if (this.coupon.type === 'percentage') {
          this.couponService.updatePercentageCoupon(this.coupon.id, this.coupon).subscribe({
            next: () => {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Coupon Updated', life: 3000 });
            this.coupons[this.findIndexById(this.coupon.id!)] = this.coupon;},
            error: (error: HttpErrorResponse) => {
            this.messageService.add({ severity: 'error', summary: "Failed", detail: `${error.error.message}`, life: 3000 });
            }
          });
        }
      } else {
        // New coupon  
        if (this.coupon.type === 'fixed') {
          this.couponService.addFixedCoupon(this.coupon).subscribe({
            next: () => {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Coupon Created', life: 3000 });
            this.coupons.push(this.coupon);},
            error: (error: HttpErrorResponse) => {
            console.error('Error:', error),
            this.messageService.add({ severity: 'error', summary: "Failed", detail: `${error.error.message}`, life: 3000 });
            }
        });
        } else if (this.coupon.type === 'percentage') {
          this.couponService.addPercentageCoupon(this.coupon).subscribe({
            next: () => {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Coupon Created', life: 3000 });
            this.coupons.push(this.coupon);},
            error: (error: HttpErrorResponse) => {
            this.messageService.add({ severity: 'error', summary: "Failed", detail: `${error.error.message}`, life: 3000 });
            }
        });
        }
      }
      this.coupons = [...this.coupons];
      this.couponDialog = false;
      this.coupon = {};
    }
  }
  
  findIndexById(id: number): number {
      let index = -1;
      for (let i = 0; i < this.coupons.length; i++) {
          if (this.coupons[i].id === id) {
              index = i;
              break;
          }
      }
      return index;
  }

  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  test: boolean = false;
  showDialog() {
    this.test = true;
  }
}
