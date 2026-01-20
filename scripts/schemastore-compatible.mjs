/**
 * Schema validation script using Ajv in strict mode.
 * Mirrors the validation approach used by SchemaStore.
 *
 * @see https://github.com/SchemaStore/schemastore/blob/master/cli.js
 */

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import YAML from 'yaml';
import fs from 'node:fs';
import path from 'node:path';

const SCHEMA_DIR = 'schemas';
const EXAMPLES_DIR = 'examples';

/**
 * Creates an Ajv instance configured for draft-07 with strict mode.
 */
function createAjv() {
  const ajv = new Ajv({
    strict: true,
    allErrors: true,
  });
  addFormats(ajv);
  return ajv;
}

/**
 * Reads and parses a data file (JSON or YAML).
 */
function readDataFile(filepath) {
  const content = fs.readFileSync(filepath, 'utf-8');
  const ext = path.extname(filepath);

  if (ext === '.json') {
    return JSON.parse(content);
  } else if (ext === '.yaml' || ext === '.yml') {
    return YAML.parse(content);
  } else {
    throw new Error(`Unsupported file extension: ${ext}`);
  }
}

/**
 * Finds all schema files in the schemas directory.
 */
function findSchemas() {
  const schemas = [];

  function scanDir(dir) {
    if (!fs.existsSync(dir)) return;

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.name.endsWith('.schema.json') || entry.name.endsWith('.json')) {
        schemas.push(fullPath);
      }
    }
  }

  scanDir(SCHEMA_DIR);
  return schemas;
}

/**
 * Finds example files for a given schema.
 */
function findExamples(schemaPath) {
  const schemaName = path.basename(path.dirname(schemaPath));
  const examplesDir = path.join(EXAMPLES_DIR, schemaName);

  if (!fs.existsSync(examplesDir)) {
    return { positive: [], negative: [] };
  }

  const positive = [];
  const negative = [];

  for (const file of fs.readdirSync(examplesDir)) {
    const fullPath = path.join(examplesDir, file);
    if (file.includes('invalid') || file.includes('negative')) {
      negative.push(fullPath);
    } else if (file.endsWith('.json') || file.endsWith('.yaml') || file.endsWith('.yml')) {
      positive.push(fullPath);
    }
  }

  return { positive, negative };
}

/**
 * Main validation function.
 */
async function main() {
  const ajv = createAjv();
  const schemas = findSchemas();
  let hasErrors = false;

  console.log('='.repeat(50));
  console.log('Schema Validation (Ajv Strict Mode)');
  console.log('='.repeat(50));
  console.log();

  if (schemas.length === 0) {
    console.log('No schemas found.');
    process.exit(0);
  }

  for (const schemaPath of schemas) {
    console.log(`>> Validating: ${schemaPath}`);

    // Step 1: Compile schema
    let validate;
    try {
      const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
      validate = ajv.compile(schema);
      console.log('   [OK] Schema compiles in strict mode');
    } catch (err) {
      console.error(`   [FAIL] Schema compilation error: ${err.message}`);
      hasErrors = true;
      continue;
    }

    // Step 2: Validate positive examples
    const { positive, negative } = findExamples(schemaPath);

    for (const examplePath of positive) {
      try {
        const data = readDataFile(examplePath);
        if (validate(data)) {
          console.log(`   [OK] Positive test: ${path.basename(examplePath)}`);
        } else {
          console.error(`   [FAIL] Positive test: ${path.basename(examplePath)}`);
          console.error(`          Errors: ${JSON.stringify(validate.errors, null, 2)}`);
          hasErrors = true;
        }
      } catch (err) {
        console.error(`   [FAIL] Error reading ${examplePath}: ${err.message}`);
        hasErrors = true;
      }
    }

    // Step 3: Validate negative examples (should fail)
    for (const examplePath of negative) {
      try {
        const data = readDataFile(examplePath);
        if (validate(data)) {
          console.error(`   [FAIL] Negative test should fail but passed: ${path.basename(examplePath)}`);
          hasErrors = true;
        } else {
          console.log(`   [OK] Negative test correctly fails: ${path.basename(examplePath)}`);
        }
      } catch (err) {
        // Parse errors in negative tests are acceptable
        console.log(`   [OK] Negative test fails to parse: ${path.basename(examplePath)}`);
      }
    }

    console.log();
  }

  console.log('='.repeat(50));
  if (hasErrors) {
    console.error('Validation FAILED');
    process.exit(1);
  } else {
    console.log('All validations PASSED');
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
