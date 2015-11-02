/**
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * http://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating JavaScript for math blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

Blockly.JavaScript.math_number = function() {
  // Numeric value.
  var code = window.parseFloat(this.getTitleValue('NUM'));
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.math_add = function() {
  return Blockly.JavaScript.math_arithmetic(this, 'ADD');
}

Blockly.JavaScript.math_subtract = function() {
  return Blockly.JavaScript.math_arithmetic(this, 'MINUS');
}

Blockly.JavaScript.math_multiply = function() {
  return Blockly.JavaScript.math_arithmetic(this, 'MULTIPLY');
}

Blockly.JavaScript.math_division = function() {
  return Blockly.JavaScript.math_arithmetic(this, 'DIVIDE');
}

Blockly.JavaScript.math_power = function() {
  return Blockly.JavaScript.math_arithmetic(this, 'POWER');
}

// Blockly.JavaScript.math_divide = function() {
//   return Blockly.JavaScript.math_arithmetic(this, 'MODULUS');
// }

Blockly.JavaScript.math_divide = function() {
  // divide operators.                                                                                                                                                                                      
  var mode = this.getTitleValue('OP');
  var tuple = Blockly.JavaScript.math_divide.OPERATORS[mode];
  var operator = tuple[0];
  var order = tuple[1];
  var argument0 = Blockly.JavaScript.valueToCode(this, 'DIVIDEND', order) || null;
  var argument1 = Blockly.JavaScript.valueToCode(this, 'DIVISOR', order) || null;

  var code;
  // Power in JavaScript requires a special case since it has no operator.
  if (mode == 'QUOTIENT') {
    code = 'Math.floor(parseInt(' +  argument0 + ' ) / parseInt( ' + argument1 + '))';
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
  }
  code = argument0 + operator + argument1;
  return [code, order];
  };

Blockly.JavaScript.math_divide.OPERATORS = {
  MODULO: [' % ', Blockly.JavaScript.ORDER_MODULUS],
  REMAINDER: [' % ', Blockly.JavaScript.ORDER_MODULUS],
  QUOTIENT: [' / ', Blockly.JavaScript.ORDER_DIVISION]
};


Blockly.JavaScript.math_arithmetic = function(block, mode) {
  // Basic arithmetic operators, and power.
  //  var mode = this.getTitleValue('OP');
  var tuple = Blockly.JavaScript.math_arithmetic.OPERATORS[mode];
  var operator = tuple[0];
  var order = tuple[1];
  var argument0 = "0";
  var argument1 = "0";
  if (mode == 'ADD' || mode == 'MULTIPLY') {
    argument0 = Blockly.JavaScript.valueToCode(block, 'NUM0', order) || '0';
    argument1 = Blockly.JavaScript.valueToCode(block, 'NUM1', order) || '0';
  } else if (mode == 'MODULUS') {
    argument0 = Blockly.JavaScript.valueToCode(block, 'DIVIDEND', order) || '0';
    argument1 = Blockly.JavaScript.valueToCode(block, 'DIVISOR', order) || '0';
  } else {
    argument0 = Blockly.JavaScript.valueToCode(block, 'A', order) || '0';
    argument1 = Blockly.JavaScript.valueToCode(block, 'B', order) || '0';
  }

  var code;
  // Power in JavaScript requires a special case since it has no operator.
  if (!operator) {
    code = 'Math.pow(' + argument0 + ', ' + argument1 + ')';
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
  }
  code = argument0 + operator + argument1;
  return [code, order];
};

Blockly.JavaScript.math_arithmetic.OPERATORS = {
  ADD: [' + ', Blockly.JavaScript.ORDER_ADDITION],
  MINUS: [' - ', Blockly.JavaScript.ORDER_SUBTRACTION],
  MULTIPLY: [' * ', Blockly.JavaScript.ORDER_MULTIPLICATION],
  DIVIDE: [' / ', Blockly.JavaScript.ORDER_DIVISION],
  MODULUS: [' % ', Blockly.JavaScript.ORDER_MODULUS],
  POWER: [null, Blockly.JavaScript.ORDER_COMMA]  // Handle power separately.
};

Blockly.JavaScript.math_single = function() {
  // Math operators with single operand.
  var operator = this.getTitleValue('OP');
  var code;
  var arg;
  if (operator == 'NEG') {
    // Negation is a special case given its different operator precedence.
    arg = Blockly.JavaScript.valueToCode(this, 'NUM',
        Blockly.JavaScript.ORDER_UNARY_NEGATION) || '0';
    if (arg[0] == '-') {
      // --3 is not legal in JS.
      arg = ' ' + arg;
    }
    code = '-' + arg;
    return [code, Blockly.JavaScript.ORDER_UNARY_NEGATION];
  }
  if (operator == 'SIN' || operator == 'COS' || operator == 'TAN') {
    arg = Blockly.JavaScript.valueToCode(this, 'NUM',
        Blockly.JavaScript.ORDER_DIVISION) || '0';
  } else {
    arg = Blockly.JavaScript.valueToCode(this, 'NUM',
        Blockly.JavaScript.ORDER_NONE) || '0';
  }
  // First, handle cases which generate values that don't need parentheses
  // wrapping the code.
  switch (operator) {
    case 'ABS':
      code = 'Math.abs(' + arg + ')';
      break;
    case 'ROOT':
      code = 'Math.sqrt(' + arg + ')';
      break;
    case 'LN':
      code = 'Math.log(' + arg + ')';
      break;
    case 'EXP':
      code = 'Math.exp(' + arg + ')';
      break;
    case 'POW10':
      code = 'Math.pow(10,' + arg + ')';
      break;
    case 'ROUND':
      code = 'Math.round(' + arg + ')';
      break;
    case 'ROUNDUP':
      code = 'Math.ceil(' + arg + ')';
      break;
    case 'ROUNDDOWN':
      code = 'Math.floor(' + arg + ')';
      break;
    case 'SIN':
      code = 'Math.sin(' + arg + ' / 180 * Math.PI)';
      break;
    case 'COS':
      code = 'Math.cos(' + arg + ' / 180 * Math.PI)';
      break;
    case 'TAN':
      code = 'Math.tan(' + arg + ' / 180 * Math.PI)';
      break;
  }
  if (code) {
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
  }
  // Second, handle cases which generate values that may need parentheses
  // wrapping the code.
  switch (operator) {
    case 'LOG10':
      code = 'Math.log(' + arg + ') / Math.log(10)';
      break;
    case 'ASIN':
      code = 'Math.asin(' + arg + ') / Math.PI * 180';
      break;
    case 'ACOS':
      code = 'Math.acos(' + arg + ') / Math.PI * 180';
      break;
    case 'ATAN':
      code = 'Math.atan(' + arg + ') / Math.PI * 180';
      break;
    default:
      throw 'Unknown math operator: ' + operator;
  }
  return [code, Blockly.JavaScript.ORDER_DIVISION];
};

Blockly.JavaScript.math_constant = function() {
  // Constants: PI, E, the Golden Ratio, sqrt(2), 1/sqrt(2), INFINITY.
  var constant = this.getTitleValue('CONSTANT');
  return Blockly.JavaScript.math_constant.CONSTANTS[constant];
};

Blockly.JavaScript.math_constant.CONSTANTS = {
  PI: ['Math.PI', Blockly.JavaScript.ORDER_MEMBER],
  E: ['Math.E', Blockly.JavaScript.ORDER_MEMBER],
  GOLDEN_RATIO: ['(1 + Math.sqrt(5)) / 2', Blockly.JavaScript.ORDER_DIVISION],
  SQRT2: ['Math.SQRT1_2', Blockly.JavaScript.ORDER_MEMBER],
  SQRT1_2: ['Math.SQRT1_2', Blockly.JavaScript.ORDER_MEMBER],
  INFINITY: ['Infinity', Blockly.JavaScript.ORDER_ATOMIC]
};

Blockly.JavaScript.math_change = function() {
  // Add to a variable in place.
  var argument0 = Blockly.JavaScript.valueToCode(this, 'DELTA',
      Blockly.JavaScript.ORDER_ADDITION) || '0';
  var varName = Blockly.JavaScript.variableDB_.getName(
      this.getTitleValue('VAR'), Blockly.Variables.NAME_TYPE);
  return varName + ' = (typeof ' + varName + ' == \'number\' ? ' + varName +
      ' : 0) + ' + argument0 + ';\n';
};

// Rounding functions have a single operand.
Blockly.JavaScript.math_round = Blockly.JavaScript.math_single;
// Trigonometry functions have a single operand.
Blockly.JavaScript.math_trig = Blockly.JavaScript.math_single;

Blockly.JavaScript.math_on_list = function() {
  // Math functions for lists.
  var func = this.getTitleValue('OP');
  var list, code;
  switch (func) {
    case 'SUM':
      list = Blockly.JavaScript.valueToCode(this, 'LIST',
          Blockly.JavaScript.ORDER_MEMBER) || '[]';
      code = list + '.reduce(function(x, y) {return x + y;})';
      break;
    case 'MIN':
      list = Blockly.JavaScript.valueToCode(this, 'LIST',
          Blockly.JavaScript.ORDER_COMMA) || '[]';
      code = 'Math.min.apply(null, ' + list + ')';
      break;
    case 'MAX':
      list = Blockly.JavaScript.valueToCode(this, 'LIST',
          Blockly.JavaScript.ORDER_COMMA) || '[]';
      code = 'Math.max.apply(null, ' + list + ')';
      break;
    case 'AVERAGE':
      // math_median([null,null,1,3]) == 2.0.
      if (!Blockly.JavaScript.definitions_['math_mean']) {
        var functionName = Blockly.JavaScript.variableDB_.getDistinctName(
            'math_mean', Blockly.Generator.NAME_TYPE);
        Blockly.JavaScript.math_on_list.math_mean = functionName;
        var func = [];
        func.push('function ' + functionName + '(myList) {');
        func.push('  return myList.reduce(function(x, y) {return x + y;}) / ' +
                  'myList.length;');
        func.push('}');
        Blockly.JavaScript.definitions_['math_mean'] = func.join('\n');
      }
      list = Blockly.JavaScript.valueToCode(this, 'LIST',
          Blockly.JavaScript.ORDER_NONE) || '[]';
      code = Blockly.JavaScript.math_on_list.math_mean + '(' + list + ')';
      break;
    case 'MEDIAN':
      // math_median([null,null,1,3]) == 2.0.
      if (!Blockly.JavaScript.definitions_['math_median']) {
        var functionName = Blockly.JavaScript.variableDB_.getDistinctName(
            'math_median', Blockly.Generator.NAME_TYPE);
        Blockly.JavaScript.math_on_list.math_median = functionName;
        var func = [];
        func.push('function ' + functionName + '(myList) {');
        func.push('  var localList = myList.filter(function (x) ' +
                  '{return typeof x == \'number\';});');
        func.push('  if (!localList.length) return null;');
        func.push('  localList.sort(function(a, b) {return b - a;});');
        func.push('  if (localList.length % 2 == 0) {');
        func.push('    return (localList[localList.length / 2 - 1] + ' +
                  'localList[localList.length / 2]) / 2;');
        func.push('  } else {');
        func.push('    return localList[(localList.length - 1) / 2];');
        func.push('  }');
        func.push('}');
        Blockly.JavaScript.definitions_['math_median'] = func.join('\n');
      }
      list = Blockly.JavaScript.valueToCode(this, 'LIST',
          Blockly.JavaScript.ORDER_NONE) || '[]';
      code = Blockly.JavaScript.math_on_list.math_median + '(' + list + ')';
      break;
    case 'MODE':
      if (!Blockly.JavaScript.definitions_['math_modes']) {
        var functionName = Blockly.JavaScript.variableDB_.getDistinctName(
            'math_modes', Blockly.Generator.NAME_TYPE);
        Blockly.JavaScript.math_on_list.math_modes = functionName;
        // As a list of numbers can contain more than one mode,
        // the returned result is provided as an array.
        // Mode of [3, 'x', 'x', 1, 1, 2, '3'] -> ['x', 1].
        var func = [];
        func.push('function ' + functionName + '(values) {');
        func.push('  var modes = [];');
        func.push('  var counts = [];');
        func.push('  var maxCount = 0;');
        func.push('  for (var i = 0; i < values.length; i++) {');
        func.push('    var value = values[i];');
        func.push('    var found = false;');
        func.push('    var thisCount;');
        func.push('    for (var j = 0; j < counts.length; j++) {');
        func.push('      if (counts[j][0] === value) {');
        func.push('        thisCount = ++counts[j][1];');
        func.push('        found = true;');
        func.push('        break;');
        func.push('      }');
        func.push('    }');
        func.push('    if (!found) {');
        func.push('      counts.push([value, 1]);');
        func.push('      thisCount = 1;');
        func.push('    }');
        func.push('    maxCount = Math.max(thisCount, maxCount);');
        func.push('  }');
        func.push('  for (var j = 0; j < counts.length; j++) {');
        func.push('    if (counts[j][1] == maxCount) {');
        func.push('        modes.push(counts[j][0]);');
        func.push('    }');
        func.push('  }');
        func.push('  return modes;');
        func.push('}');
        Blockly.JavaScript.definitions_['math_modes'] = func.join('\n');
      }
      list = Blockly.JavaScript.valueToCode(this, 'LIST',
          Blockly.JavaScript.ORDER_NONE) || '[]';
      code = Blockly.JavaScript.math_on_list.math_modes + '(' + list + ')';
      break;
    case 'STD_DEV':
      if (!Blockly.JavaScript.definitions_['math_standard_deviation']) {
        var functionName = Blockly.JavaScript.variableDB_.getDistinctName(
            'math_standard_deviation', Blockly.Generator.NAME_TYPE);
        Blockly.JavaScript.math_on_list.math_standard_deviation = functionName;
        var func = [];
        func.push('function ' + functionName + '(numbers) {');
        func.push('  var n = numbers.length;');
        func.push('  if (!n) return null;');
        func.push('  var mean = numbers.reduce(function(x, y) ' +
                  '{return x + y;}) / n;');
        func.push('  var variance = 0;');
        func.push('  for (var j = 0; j < n; j++) {');
        func.push('    variance += Math.pow(numbers[j] - mean, 2);');
        func.push('  }');
        func.push('  variance = variance / n;');
        func.push('  return Math.sqrt(variance);');
        func.push('}');
        Blockly.JavaScript.definitions_['math_standard_deviation'] =
            func.join('\n');
      }
      list = Blockly.JavaScript.valueToCode(this, 'LIST',
          Blockly.JavaScript.ORDER_NONE) || '[]';
      code = Blockly.JavaScript.math_on_list.math_standard_deviation +
          '(' + list + ')';
      break;
    case 'RANDOM':
      if (!Blockly.JavaScript.definitions_['math_random_item']) {
        var functionName = Blockly.JavaScript.variableDB_.getDistinctName(
            'math_random_item', Blockly.Generator.NAME_TYPE);
        Blockly.JavaScript.math_on_list.math_random_item = functionName;
        var func = [];
        func.push('function ' + functionName + '(list) {');
        func.push('  var x = Math.floor(Math.random() * list.length);');
        func.push('  return list[x];');
        func.push('}');
        Blockly.JavaScript.definitions_['math_random_item'] = func.join('\n');
      }
      list = Blockly.JavaScript.valueToCode(this, 'LIST',
          Blockly.JavaScript.ORDER_NONE) || '[]';
      code = Blockly.JavaScript.math_on_list.math_random_item +
          '(' + list + ')';
      break;
    default:
      throw 'Unknown operator: ' + func;
  }
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript.math_modulo = function() {
  // Remainder computation.
  var argument0 = Blockly.JavaScript.valueToCode(this, 'DIVIDEND',
      Blockly.JavaScript.ORDER_MODULUS) || '0';
  var argument1 = Blockly.JavaScript.valueToCode(this, 'DIVISOR',
      Blockly.JavaScript.ORDER_MODULUS) || '0';
  var code = argument0 + ' % ' + argument1;
  return [code, Blockly.JavaScript.ORDER_MODULUS];
};

Blockly.JavaScript.math_constrain = function() {
  // Constrain a number between two limits.
  var argument0 = Blockly.JavaScript.valueToCode(this, 'VALUE',
      Blockly.JavaScript.ORDER_COMMA) || '0';
  var argument1 = Blockly.JavaScript.valueToCode(this, 'LOW',
      Blockly.JavaScript.ORDER_COMMA) || '0';
  var argument2 = Blockly.JavaScript.valueToCode(this, 'HIGH',
      Blockly.JavaScript.ORDER_COMMA) || 'Infinity';
  var code = 'Math.min(Math.max(' + argument0 + ', ' + argument1 + '), ' +
      argument2 + ')';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript.math_random_int = function() {
  // Random integer between [X] and [Y].
  var argument0 = Blockly.JavaScript.valueToCode(this, 'FROM',
      Blockly.JavaScript.ORDER_COMMA) || '0';
  var argument1 = Blockly.JavaScript.valueToCode(this, 'TO',
      Blockly.JavaScript.ORDER_COMMA) || '0';
  if (!Blockly.JavaScript.definitions_['math_random_int']) {
    var functionName = Blockly.JavaScript.variableDB_.getDistinctName(
        'math_random_int', Blockly.Generator.NAME_TYPE);
    Blockly.JavaScript.math_random_int.random_function = functionName;
    var func = [];
    func.push('function ' + functionName + '(a, b, c) {');
    func.push('  if (a > b) {');
    func.push('    // Swap a and b to ensure a is smaller.');
    func.push('    c = a;');
    func.push('    a = b;');
    func.push('    b = c;');
    func.push('  }');
    func.push('  return Math.floor(Math.random() * (b - a + 1) + a);');
    func.push('}');
    Blockly.JavaScript.definitions_['math_random_int'] = func.join('\n');
  }
  var code = Blockly.JavaScript.math_random_int.random_function +
      '(' + argument0 + ', ' + argument1 + ')';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript.math_random_float = function() {
  // Random fraction between 0 and 1.
  return ['Math.random()', Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

/**
 * The App Inventor is_a_number function.  
 */
Blockly.JavaScript.math_is_a_number = function() {
  var arg = Blockly.JavaScript.valueToCode(this, 'NUM', Blockly.JavaScript.ORDER_NONE) || '0';
  var code = '!Math.NaN(' + arg + ')';
  if (code) {
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
  }
};

/**
 * The App Inventor random_set_seed procedure.
 * 
 * NOTE: JavaScript does not have a built-in set_seed function. So
 *  to do this you'd have to write your own RNG. It appears
 *  from the Yail code here that Kawa has a random-set-seed function.
 */
Blockly.JavaScript.math_random_set_seed = function() {
  // Basic is_a_number.
  var argument = Blockly.JavaScript.valueToCode(this, 'NUM', Blockly.Yail.ORDER_NONE) || '0';
//  var code ;
//   var code = Blockly.Yail.YAIL_CALL_YAIL_PRIMITIVE + "random-set-seed"
//       + Blockly.Yail.YAIL_SPACER;
//   code = code + Blockly.Yail.YAIL_OPEN_COMBINATION
//       + Blockly.Yail.YAIL_LIST_CONSTRUCTOR + Blockly.Yail.YAIL_SPACER
//       + argument + Blockly.Yail.YAIL_CLOSE_COMBINATION;
//   code = code + Blockly.Yail.YAIL_SPACER + Blockly.Yail.YAIL_QUOTE
//       + Blockly.Yail.YAIL_OPEN_COMBINATION + "number"
//       + Blockly.Yail.YAIL_CLOSE_COMBINATION + Blockly.Yail.YAIL_SPACER;
//   code = code + Blockly.Yail.YAIL_DOUBLE_QUOTE + "random set seed"
//       + Blockly.Yail.YAIL_DOUBLE_QUOTE + Blockly.Yail.YAIL_CLOSE_COMBINATION;
//  return code;
};
