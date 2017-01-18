'use strict';

var chai = require('chai');
var expect = chai.expect;

var extend = require('../src/util').extend;
var Accordion = require('../src/accordion').Accordion;

function isOpen(trigger) {
  return trigger.getAttribute('aria-expanded') === 'true' &&
    document.querySelector('#' + trigger.getAttribute('aria-controls')).getAttribute('aria-hidden') === 'false';
}

function isClosed(trigger) {
  return trigger.getAttribute('aria-expanded') === 'false' &&
    document.querySelector('#' + trigger.getAttribute('aria-controls')).getAttribute('aria-hidden') === 'true';
}

describe('extend function', function() {
  it('should copy props in source objs to dest obj', function() {
    var obj = extend({}, {foo: 1}, {bar: 2});
    expect(obj).to.deep.equal({foo: 1, bar: 2});
  });

  it('should use prop vals in later sources if same name', function() {
    var obj = extend({}, {foo: 1}, {foo: 2});
    expect(obj).to.deep.equal({foo: 2});
  });
});

describe('accordion', function() {
  before(function() {
    this.fixture = document.createElement('div');
    this.fixture.id = 'fixtures';
    document.body.appendChild(this.fixture);
  });

  beforeEach(function() {
    this.fixture.innerHTML =
      '<div class="accordion-1">' +
        '<ul>' +
          '<li>' +
            '<button></button>' +
            '<div>Some content</div>' +
          '</li>' +
          '<li>' +
            '<button></button>' +
            '<div>Some content</div>' +
          '</li>' +
        '</ul>' +
      '</div>' +
      '<div class="accordion-2">' +
        '<button>Accordion 2 button</button>' +
        '<div>Some content</div>' +
      '</div>';
    var elm1 = document.querySelector('.accordion-1');
    var elm2 = document.querySelector('.accordion-2');
    this.accordion = new Accordion(elm1, {}, {collapseOthers: true});
    this.accordion2 = new Accordion(elm2, {}, {contentPrefix: 'second'});
  });

  it('should find triggers on init', function() {
    expect(this.accordion.triggers.length).to.equal(2);
  });

  it('should set aria attributes', function() {
    var trigger = this.accordion.triggers[0];
    var content = document.getElementById('accordion-content-0');
    expect(trigger.getAttribute('aria-expanded')).to.equal('false');
    expect(trigger.getAttribute('aria-controls')).to.equal('accordion-content-0');
    expect(content.getAttribute('aria-hidden')).to.equal('true');
  });

  it('should set styles to display: none', function() {
    var trigger = this.accordion.triggers[0];
    var content = document.getElementById('accordion-content-0');
    expect(content.style.display).to.equal('none');
    this.accordion.expand(trigger);
    expect(content.style.display).to.equal('block');
  });

  it('should expand the item on click', function() {
    var trigger = this.accordion.triggers[0];
    this.accordion.expand(trigger);
    expect(isOpen(trigger)).to.be.true;
  });

  it('should collapse an open item when clicking', function() {
    var trigger = this.accordion.triggers[1];
    this.accordion.collapse(trigger);
    expect(isClosed(trigger, this.accordion)).to.be.true;
  });

  it('should collapse others on expand', function() {
    this.accordion.expand(this.accordion.triggers[0]);
    this.accordion.expand(this.accordion.triggers[1]);
    expect(isClosed(this.accordion.triggers[0])).to.be.true;
    expect(isOpen(this.accordion.triggers[1])).to.be.true;
  });

  it('removes listeners on destroy', function() {
    this.accordion.destroy();
    var trigger = this.accordion.triggers[0];
    trigger.click();
    expect(isOpen(trigger, this.accordion)).to.be.false;
  });

  describe('page with multiple accordions', function() {
    it('should find the one trigger', function() {
      expect(this.accordion2.triggers.length).to.equal(1);
    });

    it('should expand the content for this accordion but not the other', function() {
      var trigger1 = this.accordion.triggers[0];
      var trigger2 = this.accordion2.triggers[0];
      this.accordion2.expand(trigger2);
      expect(isOpen(trigger2)).to.be.true;
      expect(isOpen(trigger1)).to.be.false;
    });
  });
});
