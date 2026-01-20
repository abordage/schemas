# Awesome Repositories Schema

JSON schema for validating awesome repositories configuration files.

## Description

This schema is designed to validate YAML/JSON files containing structured catalogs
of repositories organized by categories and subcategories.

## Usage

### Editor Integration

Add to your YAML file:

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/abordage/schemas/main/schemas/awesome-repositories/awesome-repositories.schema.json

categories:
  # your configuration
```

### CI/CD Integration

Use the [schema-validation-action](https://github.com/marketplace/actions/schema-validation-action)
for automated validation in your workflows:

```yaml
# Validate single file
- name: Validate awesome repositories
  uses: cardinalby/schema-validator-action@v3
  with:
    file: 'config/repositories.yaml'
    schema: 'https://raw.githubusercontent.com/abordage/schemas/main/schemas/awesome-repositories/awesome-repositories.schema.json'

# Validate multiple files
- name: Validate all repository configs
  uses: cardinalby/schema-validator-action@v3
  with:
    file: 'configs/*.yaml'
    schema: 'https://raw.githubusercontent.com/abordage/schemas/main/schemas/awesome-repositories/awesome-repositories.schema.json'

# Auto-validation using $schema property in files
- name: Validate repositories with embedded schema
  uses: cardinalby/schema-validator-action@v3
  with:
    file: 'configs/repositories.yaml'
    # No schema parameter needed if file contains $schema property
```

## Data Structure

### Root Object

| Field        | Type  | Required | Description                    |
|--------------|-------|----------|--------------------------------|
| `categories` | array | ✓        | Array of repository categories |

### Category

| Field           | Type   | Required | Description            |
|-----------------|--------|----------|------------------------|
| `name`          | string | ✓        | Category name          |
| `description`   | string | ✗        | Category description   |
| `repos`         | array  | ✗        | Array of repositories  |
| `subcategories` | array  | ✗        | Array of subcategories |

### Subcategory

| Field         | Type   | Required | Description             |
|---------------|--------|----------|-------------------------|
| `name`        | string | ✓        | Subcategory name        |
| `description` | string | ✗        | Subcategory description |
| `repos`       | array  | ✓        | Array of repositories   |

### Repository

| Field         | Type   | Required | Description            |
|---------------|--------|----------|------------------------|
| `url`         | string | ✓        | GitHub repository URL  |
| `name`        | string | ✗        | Custom repository name |
| `description` | string | ✗        | Repository description |

## Validation Rules

### Basic Rules
- URLs must match the GitHub repository pattern
- Category and subcategory names cannot be empty
- Subcategories must contain at least one repository
- Root object must contain at least one category
- Repository arrays (`repos`) cannot be empty – must contain at least one repository when present

### Uniqueness Constraints
- **Category names** must be unique within the `categories` array
- **Subcategory names** must be unique within each parent category
- **Repository objects** must be unique within each `repos` array

### Uniqueness Limitations
**Note**: JSON Schema Draft 7 uses `uniqueItems` which compares entire objects for equality. This means:
- For repositories: The entire repository object (url, name, description) must be identical to be considered duplicate
- For categories/subcategories: The entire object must be identical to be considered duplicate
- For field-specific uniqueness (e.g., only URL uniqueness), additional validation tools may be needed

## Examples

See `examples/awesome-repositories/` folder for complete usage examples. 
