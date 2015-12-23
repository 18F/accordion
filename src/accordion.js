'use strict';

var _ = require('underscore');

var defaultOpts = {
  collapseOthers: false,
  customHiding: false,
  classes: {
    expandedButton: 'accordion-trigger--expanded'
  }
};

var defaultSelectors = {
  body: '.js-accordion',
  trigger: 'button'
};

var Accordion = function(selectors, opts) {
  this.selectors = _.extend({}, defaultSelectors, selectors);
  this.opts = _.extend({}, defaultOpts, opts);

  this.body = document.querySelector(this.selectors.body);
  this.triggers = this.findTriggers();

  this.listeners = [];
  this.addEventListener(this.body, 'click', this.handleClickBody.bind(this));
};

Accordion.prototype.handleClickBody = function(e) {
  if (_.contains(this.triggers, e.target)) {
    this.toggle(e.target);
  }
};

Accordion.prototype.findTriggers = function() {
  var self = this;
  var triggers = this.body.querySelectorAll(this.selectors.trigger);
  _.each(triggers, function(trigger, index) {
    self.setAria(trigger, index);
  });
  return triggers;
};

Accordion.prototype.setAria = function(trigger, index) {
  var contentID = 'content-' + index;
  var content = trigger.nextElementSibling;
  trigger.setAttribute('aria-controls', contentID);
  trigger.setAttribute('aria-expanded', 'false');
  content.setAttribute('id', contentID);
  content.setAttribute('aria-hidden', 'true');
  this.setStyles(content);
};

Accordion.prototype.toggle = function(elm) {
  var f = elm.getAttribute('aria-expanded') === 'true' ? this.collapse : this.expand;
  f.call(this, elm);
};

Accordion.prototype.expand = function(button) {
  if (this.opts.collapseOthers) {
    this.collapseAll();
  }
  var content = document.querySelector('#' + button.getAttribute('aria-controls'));
  button.setAttribute('aria-expanded', 'true');
  button.classList.add(this.opts.classes.expandedButton);
  content.setAttribute('aria-hidden', 'false');
  this.setStyles(content);
};

Accordion.prototype.collapse = function(button) {
  var content = document.querySelector('#' + button.getAttribute('aria-controls'));
  button.setAttribute('aria-expanded', 'false');
  button.classList.remove(this.opts.classes.expandedButton);
  content.setAttribute('aria-hidden', 'true');
  this.setStyles(content);
};

Accordion.prototype.collapseAll = function() {
  var self = this;
  _.each(this.triggers, function(trigger) {
    self.collapse(trigger);
  });
};

Accordion.prototype.expandAll = function() {
  var self = this;
  this.triggers.forEach(function(trigger) {
    self.expand(trigger);
  });
};

Accordion.prototype.setStyles = function(content) {
  var prop = content.getAttribute('aria-hidden') === 'true' ? 'none' : 'block';

  if (!this.opts.customHiding) {
    content.style.display = prop;
  };
};

Accordion.prototype.addEventListener = function(elm, event, callback) {
  if (elm) {
    elm.addEventListener(event, callback);
    this.listeners.push({
      elm: elm,
      event: event,
      callback: callback
    });
  }
};

Accordion.prototype.destroy = function() {
  this.listeners.forEach(function(listener) {
    listener.elm.removeEventListener(listener.event, listener.callback);
  });
};

module.exports = { Accordion: Accordion };
