/**
 * @file
 *
 * File with configuration to server part of application.
 */

export default function config() {
  const serverConfig = {
    // Base URL of your Drupal site.
    base: 'http://ffw.lndo.site',
    // Name to use when storing the token in localStorage.
    token_name: 'drupal-oauth-token',
    // OAuth client ID - get from Drupal.
    client_id: '53521cf9-168d-4f48-96d3-d88f47f83f05',
    // OAuth client secret - set in Drupal.
    client_secret: 'abc123',
    // Drupal user role related to this OAuth client.
    scope: 'api'
  };
  return serverConfig;
}
