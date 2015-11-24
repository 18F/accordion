'use strict';

var chai = require('chai');
var expect = chai.expect;

var Accordion = require('../src/accordion').Accordion;

function isOpen(trigger, accordion) {
 return trigger.getAttribute('aria-expanded') === 'true' &&
  trigger.classList.contains(accordion.opts.classes.expandedButton) &&
  document.querySelector('#' + trigger.getAttribute('aria-controls')).getAttribute('aria-hidden') === 'false'
};

function isClosed(trigger, accordion) {
 return trigger.getAttribute('aria-expanded') === 'false' &&
  !trigger.classList.contains(accordion.opts.classes.expandedButton) &&
  document.querySelector('#' + trigger.getAttribute('aria-controls')).getAttribute('aria-hidden') === 'true'
};

describe('accordion', function() {
  before(function() {
    this.fixture = document.createElement('div');
    this.fixture.id = 'fixtures';
    document.body.appendChild(this.fixture);
  });

  beforeEach(function() {
    this.fixture.innerHTML =
      '<div class="js-accordion">' +
        '<ul>' +
          '<li>' +
            '<button aria-controls="content-0" aria-expanded="false"></button>' +
            '<div id="content-0" aria-hidden="true">Some content</div>' +
          '</li>' +
          '<li>' +
            '<button aria-controls="content-1" aria-expanded="true"></button>' +
            '<div id="content-1" aria-hidden="false">Some content</div>' +
          '</li>' +
        '</ul>'
      '</div>'
    this.accordion = new Accordion();
  });

  it('should find triggers on init', function() {
    expect(this.accordion.triggers.length).to.equal(2);
  });

  it('should expand the item on click', function() {
    var trigger = this.accordion.triggers[0];
    this.accordion.expand(trigger);
    expect(isOpen(trigger, this.accordion)).to.be.true;
  });

  it('should collapse an open item when clicking', function() {
    var trigger = this.accordion.triggers[1];
    this.accordion.collapse(trigger);
    expect(isClosed(trigger, this.accordion)).to.be.true;
  });
});
