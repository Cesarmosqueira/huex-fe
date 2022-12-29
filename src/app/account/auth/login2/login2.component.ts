import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../../../core/services/auth.service';

import { OwlOptions } from 'ngx-owl-carousel-o';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { User } from 'src/app/core/models/auth.models';
import Swal from 'sweetalert2';
import { config } from 'src/app/shared/shared.config';

@Component({
  selector: 'app-login2',
  templateUrl: './login2.component.html',
  styleUrls: ['./login2.component.scss']
})
/**
 * Login-2 component
 */
export class Login2Component implements OnInit {

  constructor(private formBuilder: UntypedFormBuilder, private route: ActivatedRoute,
    private router: Router, private authenticationService: AuthenticationService) { }
  loginForm: UntypedFormGroup;
  submitted = false;
  error = '';
  returnUrl: string;

  // set the currenr year
  year: number = new Date().getFullYear();

  ngOnInit(): void {
    document.body.classList.add('auth-body-bg')
    this.loginForm = this.formBuilder.group({
      email: ['jgala', [Validators.required]],
      password: ['jgala', [Validators.required]],
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
    console.log(user);
    this.authenticationService.login(user)
      .pipe(first())
      .subscribe(
        () => {
          this.router.navigate(['/dashboard']);
        },
        () => {
          Swal.fire({
            icon: config.ERROR,
            title: "Usuario o contraseña incorrecto",
            showConfirmButton: false,
          });
        });
  }
}
