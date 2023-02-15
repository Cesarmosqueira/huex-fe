import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../../../core/services/auth.service';

import { OwlOptions } from 'ngx-owl-carousel-o';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { User } from 'src/app/core/models/auth.models';
import Swal from 'sweetalert2';
import { config } from 'src/app/shared/shared.config';
import { MenuService } from 'src/app/core/services/menu.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
/**
 * Login-2 component
 */
export class LoginComponent implements OnInit {

  menuItems = [];

  constructor(private formBuilder: UntypedFormBuilder, private route: ActivatedRoute,
    private router: Router, private authenticationService: AuthenticationService, private menuService: MenuService) { }
  loginForm: UntypedFormGroup;
  submitted = false;
  error = '';
  returnUrl: string;

  // set the currenr year
  year: number = new Date().getFullYear();

  ngOnInit(): void {
    document.body.classList.add('auth-body-bg')
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    // reset login status
    // this.authenticationService.logout();
    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  carouselOption: OwlOptions = {
    items: 1,
    loop: false,
    margin: 0,
    nav: false,
    dots: true,
    responsive: {
      680: {
        items: 1
      },
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    } else {
      let user = new User();
      user.userName = this.f.email.value;
      user.password = this.f.password.value;
      this.login(user);
    }
  }

  login(user) {
    this.authenticationService.login(user)
      .pipe(first())
      .subscribe(
        (response) => {
          this.listCheckLists(response.user.id);
        },
        () => {
          Swal.fire({
            icon: config.ERROR,
            title: "Usuario o contraseña incorrecto",
            showConfirmButton: false,
          });
        });
  }

  listCheckLists(idUser) {
    this.menuService.listMenusByIdUser(idUser)
      .pipe(first())
      .subscribe(
        response => {
          if (response) {
            if (response.datos) {
              this.menuItems = response.datos.menus;
              localStorage.setItem('menuItems', JSON.stringify(this.menuItems));
              this.router.navigate(['/dashboard']);
            } else {
              this.authenticationService.logout();
              Swal.fire({
                icon: config.WARNING,
                title: "Debe configurar los permisos para el usuario",
                showConfirmButton: false,
              });
            }
          } else {
            this.authenticationService.logout();
            Swal.fire({
              icon: config.ERROR,
              title: "Ocurrio un error",
              showConfirmButton: false,
            });
          }
        },
        error => {
          this.authenticationService.logout();
          Swal.fire({
            icon: config.ERROR,
            title: error,
            showConfirmButton: false,
          });
        });
  }
}
