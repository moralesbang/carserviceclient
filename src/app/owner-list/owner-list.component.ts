import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarService } from '../shared/car/car.service';
import { OwnerService } from '../shared/owner/owner.service';

@Component({
  selector: 'app-owner-list',
  templateUrl: './owner-list.component.html',
  styleUrls: ['./owner-list.component.css']
})
export class OwnerListComponent implements OnInit {
  owners: Array<any>;
  checkedOwners = [];

  constructor(
    private ownerService: OwnerService,
    private carService: CarService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.ownerService.getAll().subscribe(data => {
      const fetchedOwners = data._embedded.owners;
      this.owners = fetchedOwners.map(value => ({...value, checked: false, id: value._links.self.href.split('/').pop()}));
    });
  }

  updateCheckedList() {
    this.checkedOwners = this.owners.filter(owner => owner.checked === true);
  }

  goToList() {
    this.router.navigate(['/owner-list']);
  }

  removeSelected() {
    this.checkedOwners.forEach(owner => {
      console.log(owner)
      this.ownerService.remove(owner._links.self.href).subscribe(() => {
        this.carService.getAll().subscribe(data => {
          data.forEach(car => {
            if (car.ownerDni === owner.dni) {
              this.carService.save({...car, ownerDni: null}).subscribe(() => {
                console.log('Success Cleaned!!!');
              }, cleanError => console.log('Error while cleaning up:', cleanError));
            }
          });
          this.goToList();
        })
      });
    });
  }
}
