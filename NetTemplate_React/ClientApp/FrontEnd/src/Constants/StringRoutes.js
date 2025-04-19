class StringRoutes {
  static initial = '/'
  static test = '/test'

  static login = '/login'

  /**
   * Retrieves the current sub-route from a given pathname.
   *
   * @param {string} pathname - The full pathname.
   * @returns {string|undefined} The last segment of the route or undefined if no pathname is provided.
   */
  getCurrentSubRoute = (pathname) => {
    if (!pathname) return;

    const subRoutes = pathname.split('/')
    return subRoutes[subRoutes.length - 1];
  }

  /**
   * Retrieves the root route from a given pathname.
   *
   * @param {string} pathname - The full pathname.
   * @returns {string|undefined} The first segment of the route after the root or undefined if no pathname is provided.
   */
  getRootRoute = (pathname) => {
    if (!pathname) return;

    const subRoutes = pathname.split('/');
    return subRoutes[1];
  }
}

export default StringRoutes
