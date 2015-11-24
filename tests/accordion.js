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
            '<button></button>' +
            '<div>Some content</div>' +
          '</li>' +
          '<li>' +
            '<button></button>' +
            '<div>Some content</div>' +
          '</li>' +
        '</ul>'
      '</div>'
    this.accordion = new Accordion();
  });

  it('should find triggers on init', function() {
    expect(this.accordion.triggers.length).to.equal(2);
  });

    it('should set aria attributes', function() {
      var trigger = this.accordion.triggers[0];
      var content = document.getElementById('content-0');
      expect(trigger.getAttribute('aria-expanded')).to.equal('false');
      expect(trigger.getAttribute('aria-controls')).to.equal('content-0');
      expect(content.getAttribute('aria-hidden')).to.equal('true');
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
