import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Autocomplete, FilePicker, NumberInput, PathSelector, Select, Slider, TextArea, TextField } from '@chartreuse/ui';

const fields = [
  { name: 'TextField', Component: TextField, tag: 'input' },
  { name: 'TextArea', Component: TextArea, tag: 'textarea' },
  { name: 'Select', Component: Select, tag: 'select', children: React.createElement('option', { value: 'team' }, 'Team') },
  { name: 'NumberInput', Component: NumberInput, tag: 'input', props: { defaultValue: 3 } },
  { name: 'Autocomplete', Component: Autocomplete, tag: 'input', props: { options: [{ value: 'team', label: 'Team' }] } },
  { name: 'FilePicker', Component: FilePicker, tag: 'input' },
  { name: 'PathSelector', Component: PathSelector, tag: 'input' },
  { name: 'Slider', Component: Slider, tag: 'input', props: { defaultValue: 3, min: 0, max: 10 } },
];

function renderField(field, props) {
  const id = `help-${field.name.toLowerCase()}`;
  const markup = renderToStaticMarkup(React.createElement(field.Component, {
    label: 'Example field', name: field.name, id, 'aria-describedby': 'external-help', ...field.props, ...props,
  }, field.children));
  const control = markup.match(new RegExp(`<${field.tag}\\b[^>]*\\bid="${id}"[^>]*>`));
  assert.ok(control, `${field.name}: native control retains its supplied ID`);
  assert.ok(markup.includes(`<label for="${id}"`), `${field.name}: label retains its native association`);
  return { id, markup, control };
}

test('single-line field sizes stay separate from native size attributes', () => {
  const sizedFields = fields.filter(field => ['TextField', 'Select'].includes(field.name));
  for (const field of sizedFields) {
    for (const size of [undefined, 'sm', 'md', 'lg']) {
      const { markup, control } = renderField(field, { size });
      assert.match(markup, new RegExp(`data-cr-input-size="${size ?? 'md'}"`), field.name);
      assert.doesNotMatch(control[0], /\ssize=/, field.name);
    }
  }
});

test('Select forwards the native row count and preserves listbox options', () => {
  const field = fields.find(field => field.name === 'Select');
  const listbox = renderField(field, { multiple: true, size: 3, defaultValue: ['team'] });
  assert.match(listbox.control[0], /\bmultiple=""/);
  assert.match(listbox.control[0], /\bsize="3"/);
  assert.match(listbox.markup, /<option[^>]*selected=""[^>]*>Team<\/option>/);
  assert.doesNotMatch(listbox.markup, /data-cr-input-size=/);

  const singleSelectListbox = renderField(field, { size: 3 });
  assert.match(singleSelectListbox.control[0], /\bsize="3"/);
  assert.doesNotMatch(singleSelectListbox.markup, /data-cr-input-size=/);

  const dropdown = renderField(field, { size: 1 });
  assert.match(dropdown.control[0], /\bsize="1"/);
  assert.match(dropdown.markup, /data-cr-input-size="md"/);
});

test('field helper text follows the native input control and remains its accessible description', () => {
  for (const field of fields) {
    const { id, markup, control } = renderField(field, { hint: 'Supporting detail.' });
    const helperIndex = markup.indexOf(`id="${id}-hint"`);
    assert.ok(helperIndex >= control.index + control[0].length, `${field.name}: helper follows its control`);
    assert.ok(markup.includes('Supporting detail.'), `${field.name}: helper remains visible content`);
    assert.ok(control[0].includes(`aria-describedby="external-help ${id}-hint"`), `${field.name}: native input retains both descriptions`);
    assert.ok(!control[0].includes('aria-invalid="true"'), `${field.name}: helper alone does not invalidate the input`);
  }
});

test('field errors replace helper text below the control without breaking native invalid semantics', () => {
  for (const field of fields) {
    const { id, markup, control } = renderField(field, { hint: 'Supporting detail.', error: 'Fix this value.' });
    const errorIndex = markup.indexOf(`id="${id}-error"`);
    assert.ok(errorIndex >= control.index + control[0].length, `${field.name}: error follows its control`);
    assert.ok(!markup.includes(`id="${id}-hint"`) && !markup.includes('Supporting detail.'), `${field.name}: error replaces the helper`);
    assert.ok(markup.includes('Fix this value.'), `${field.name}: error remains visible content`);
    assert.ok(control[0].includes('aria-invalid="true"'), `${field.name}: native control is invalid`);
    assert.ok(control[0].includes(`aria-describedby="external-help ${id}-error"`), `${field.name}: native input describes its error`);
  }
});
