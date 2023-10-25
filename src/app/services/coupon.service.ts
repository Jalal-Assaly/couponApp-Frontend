import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Coupon } from './coupon'
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }


  // Subscriber functions
  public getAllCoupons(): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(`${this.apiServerUrl}/list`);
  }

  public addFixedCoupon(coupon: Coupon): Observable<Coupon> {
    return this.http.post<Coupon>(`${this.apiServerUrl}/add/fixed`, coupon)
  }

  public addPercentageCoupon(coupon: Coupon): Observable<void> {
    return this.http.post<void>(`${this.apiServerUrl}/add/percentage`, coupon)
  }

  public updateFixedCoupon(id: number, coupon: Coupon): Observable<void> {
    return this.http.put<void>(`${this.apiServerUrl}/update/fixed/${id}`, coupon)
  }

  public updatePercentageCoupon(id: number, coupon: Coupon): Observable<void> {
    return this.http.put<void>(`${this.apiServerUrl}/update/percentage/${id}`, coupon)
  }

  public deleteCoupon(id:number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/delete/${id}`)
  }
}
