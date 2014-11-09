describe('main page', function () {
  it('should load main page', function () {
    browser.get('/');
    expect(browser.getTitle()).toBe('Gallery');
  });
});
