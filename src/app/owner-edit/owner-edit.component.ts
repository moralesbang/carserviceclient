import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { error } from 'protractor';
import { Subscription } from 'rxjs';
import { CarService } from '../shared/car/car.service';
import { OwnerService } from '../shared/owner/owner.service';

@Component({
  selector: 'app-owner-edit',
  templateUrl: './owner-edit.component.html',
  styleUrls: ['./owner-edit.component.css']
})
export class OwnerEditComponent implements OnInit {
  owner: any = {};
  sub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ownerService: OwnerService,
    private carService: CarService
  ) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      const id = params['id'];

      if (id) {
        this.ownerService.get(id).subscribe((owner: any) => {
          if (owner) {
            this.owner = owner;
            this.owner.href = owner._links.self.href;
          } else {
            console.log(`Owner with id '${id}' not found, returning to list...`);
            this.goToList();
          }
        })
      }
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  goToList() {
    this.router.navigate(['/owner-list']);
  }

  save(form: NgForm) {
    this.ownerService.save(form).subscribe(result => {
      this.goToList();
    }, error => console.log('[OWNER EDIT ERROR]:', error))
  }

  remove(href) {
    this.ownerService.remove(href).subscribe(result => {
      this.carService.getAll().subscribe(data => {
        data.forEach(car => {
          if (car.ownerDni === this.owner.dni) {
            this.carService.save({...car, ownerDni: null}).subscribe(() => {
              this.goToList();
            }, cleanError => console.log('Error while cleaning up:', cleanError));
          }
        });
      });
    }, removeError => console.error('Error while removing owner', removeError));
  }
}
