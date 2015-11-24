'use strict';

var _ = require('underscore');

var defaultOpts = {
  collapseOthers: false,
  classes: {
    expandedButton: 'accordion-trigger--expanded'
  }
};

var defaultSelectors = {
  body: '.js-accordion',
  trigger: 'button',
};

var Accordion = function(selectors, opts) {
  var self = this;
  self.selectors = _.extend({}, defaultSelectors, selectors);
  self.opts = _.extend({}, defaultOpts, opts);

  self.body = document.querySelector(this.selectors.body);
  self.triggers = self.findTriggers();

  self.body.addEventListener('click', function(e) {
    if ( _.contains(self.triggers, e.target) ) {
      if (self.opts.collapseOthers) {
        self.collapseAll();
      }
      self.toggle(e.target);
    }
  });
};

Accordion.prototype.findTriggers = function() {
  var triggers = this.body.querySelectorAll(this.selectors.trigger);
  var newTriggers = [];
  _.each(triggers, function(trigger) {
    newTriggers.push(trigger);
  });

  return newTriggers;
};

Accordion.prototype.toggle = function(elm) {
  var button = elm;
  var f = elm.getAttribute('aria-expanded') === 'true' ? this.collapse : this.expand;
  f.call(this, button);
};

Accordion.prototype.expand = function(button) {
  var content = document.querySelector('#' + button.getAttribute('aria-controls'));
  button.setAttribute('aria-expanded', 'true');
  button.classList.add(this.opts.classes.expandedButton);
  content.setAttribute('aria-hidden', 'false');
};

Accordion.prototype.collapse = function(button) {
  var content = document.querySelector('#' + button.getAttribute('aria-controls'));
  button.setAttribute('aria-expanded', 'false');
  button.classList.remove(this.opts.classes.expandedButton);
  content.setAttribute('aria-hidden', 'true');
};

Accordion.prototype.collapseAll = function() {
  var self = this;
  this.triggers.forEach(function(trigger) {
    self.collapse(trigger);
  });
};

Accordion.prototype.expandAll = function() {
  var self = this;
  this.triggers.forEach(function(trigger) {
    self.expand(trigger);
  });
};

module.exports = {Accordion: Accordion};
