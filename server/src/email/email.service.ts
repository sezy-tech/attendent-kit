import { Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import Mailgun from 'mailgun.js';
import { User } from 'src/modules/user/user.schema';
const FormData = require('form-data');

@Injectable()
export class EmailService {
  send({
    user
  }:{
    user: User
  }
  ) {
    const mailgun = new Mailgun(FormData);

    const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY || 'key-yourkeyhere' });
    console.log({ username: 'api', key: process.env.MAILGUN_API_KEY || 'key-yourkeyhere' })
    mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: "AAS <support@aasiu.org>",
      to: [user.email],
      cc: ["ltnga@hcmiu.edu.vn"],
      subject: "Request Attendance Checking",
      text: "Testing some Mailgun awesomeness!",
      template: "request_attendance_checking	",
      "v:student_name": user.name,
    })
      .then(msg => console.log(msg)) // logs response data
      .catch(err => console.log(err)); // logs any error
  }
}
