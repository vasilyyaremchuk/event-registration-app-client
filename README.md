# Event registration application: client part.

It's not a production ready solution but just a prof of concept.
This solution is based on https://github.com/DrupalizeMe/react-and-drupal-examples/tree/master/react-decoupled

# Installation

1. Please read https://github.com/DrupalizeMe/react-and-drupal-examples/blob/master/react-decoupled/README.md about how to run the application.

2. You must specify settings in '/src/config/config.js' to point to your API server and get the data from /admin/config/services/consumer/1/edit on your server (see #11 https://github.com/vasilyyaremchuk/event-registration-app-server/blob/main/README.md)

# Usage

There is public Participant registartion form

# Potential Issues and Improvments

1. There can be issue with earlier node version. To fix it run
```
$ nvm i 15
```

2. There is one active event that use sticky Drupal property that goes on the front page.
There is no validation on admin to have only one sticky event. If there are several active events
only one the most resent will be on the front page.

3. It worth to add captcha on the Participant registration form.

4. If you don't see the event list on /dashboard you have to delete all tokens in server admin
/admin/config/people/simple_oauth/oauth2_token (server application).

5. If you can't login with
see the issue https://www.drupal.org/project/drupal/issues/3260839

6. There is the ability to delete Participants without edit in admin.

# Related Projects

https://github.com/vasilyyaremchuk/event-registration-app-server

https://github.com/vasilyyaremchuk/event-registration-app-lambda



## References

https://github.com/DrupalizeMe/react-and-drupal-examples/tree/master/react-decoupled

https://drupalize.me/tutorial/create-fully-decoupled-react-application?p=3253
