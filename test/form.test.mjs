import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Form, FormLayout, Grid, GridItem, TextField, Select, Button } from '@chartreuse/ui';

test('Form retains the native form contract and action order without wrapping inputs in another form', () => {
  const markup = renderToStaticMarkup(React.createElement(Form, {
    id: 'profile', className: 'profile-form', action: '/profile', method: 'post',
    'aria-label': 'Profile details', autoComplete: 'on', noValidate: true,
    actions: React.createElement(Button, { type: 'submit', name: 'intent', value: 'save' }, 'Save profile'),
  }, React.createElement(Grid, { columns: 1 }, React.createElement(GridItem, { span: 1 }, React.createElement(TextField, { id: 'display-name', label: 'Display name', name: 'displayName', required: true })))));
  assert.match(markup, /^<form[^>]*id="profile"[^>]*action="\/profile"[^>]*method="post"/);
  for (const attribute of ['class="cr-form profile-form"', 'aria-label="Profile details"', 'autoComplete="on"', 'noValidate=""']) assert.ok(markup.includes(attribute), attribute);
  assert.equal([...markup.matchAll(/<form\b/g)].length, 1);
  assert.ok(markup.includes('data-layout="vertical"'));
  assert.ok(markup.includes('--cr-form-label-width:144px') && markup.includes('--cr-form-label-align:start'));
  assert.ok(markup.indexOf('name="displayName"') < markup.indexOf('class="cr-form-actions"'));
  assert.match(markup, /<button(?=[^>]*name="intent")(?=[^>]*value="save")(?=[^>]*type="submit")[^>]*>/);
  assert.doesNotMatch(markup, /role="form"|role="grid"/);
});

test('FormLayout establishes a local div scope while fields keep their labels and error relationships', () => {
  const markup = renderToStaticMarkup(React.createElement(Form, { layout: 'horizontal', labelWidth: 180, labelAlign: 'end' },
    React.createElement(TextField, { id: 'email', label: 'Email', name: 'email', error: 'Enter a valid email.' }),
    React.createElement(FormLayout, { id: 'local-section', role: 'group', 'aria-label': 'Local preferences', style: { maxInlineSize: 520 } },
      React.createElement(Select, { id: 'visibility', label: 'Visibility', name: 'visibility', hint: 'Who can see this profile.' }, React.createElement('option', { value: 'team' }, 'Team')),
    ),
  ));
  assert.equal([...markup.matchAll(/<form\b/g)].length, 1);
  assert.match(markup, /<div[^>]*id="local-section"[^>]*role="group"[^>]*aria-label="Local preferences"[^>]*style="max-inline-size:520px"[^>]*class="cr-form-layout">/);
  assert.equal([...markup.matchAll(/data-layout="horizontal"/g)].length, 1);
  assert.equal([...markup.matchAll(/data-layout="vertical"/g)].length, 1);
  assert.ok(markup.includes('--cr-form-label-width:180px') && markup.includes('--cr-form-label-width:144px'));
  assert.ok(markup.includes('<label for="email">Email</label>'));
  assert.ok(markup.includes('aria-invalid="true"') && markup.includes('aria-describedby="email-error"'));
  assert.ok(markup.includes('id="email-error"') && markup.includes('aria-describedby="visibility-hint"') && markup.includes('id="visibility-hint"'));
});

test('layout props are normalized and kept off native form and div attributes', () => {
  const markup = renderToStaticMarkup(React.createElement(FormLayout, {
    layout: 'inline', labelWidth: '10rem', labelAlign: 'end', dir: 'rtl', title: 'Filters', actions: false,
  }, React.createElement(TextField, { label: 'Owner', name: 'owner' })));
  assert.ok(markup.includes('data-layout="inline"') && markup.includes('--cr-form-label-width:10rem'));
  assert.ok(markup.includes('dir="rtl"') && markup.includes('title="Filters"'));
  assert.ok(!markup.includes('class="cr-form-actions"'));
  assert.doesNotMatch(markup, /\s(?:layout|labelWidth|labelAlign|actions)=/);
  const fallback = renderToStaticMarkup(React.createElement(Form, { layout: 'unknown', labelAlign: 'left', labelWidth: Number.NaN }));
  assert.ok(fallback.includes('data-layout="vertical"') && fallback.includes('--cr-form-label-width:144px') && fallback.includes('--cr-form-label-align:start'));
});
