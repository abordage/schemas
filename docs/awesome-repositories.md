# Awesome Repositories Schema

JSON schema for validating awesome repositories configuration files.

## Description

This schema is designed to validate YAML/JSON files containing structured catalogs of repositories organized by categories and subcategories.

## Usage

### Editor Integration

Add to your YAML file:

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/abordage/schemas/main/schemas/awesome-repositories/awesome-repositories.schema.json

categories:
  # your configuration
```

### CI/CD Integration

Use the [schema-validation-action](https://github.com/marketplace/actions/schema-validation-action) for automated validation in your workflows:

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

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `categories` | array | ✓ | Array of repository categories |

### Category

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✓ | Category name |
| `description` | string | ✗ | Category description |
| `repos` | array | ✗ | Array of repositories |
| `subcategories` | array | ✗ | Array of subcategories |

### Subcategory

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✓ | Subcategory name |
| `description` | string | ✗ | Subcategory description |
| `repos` | array | ✓ | Array of repositories |

### Repository

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | string | ✓ | GitHub repository URL |
| `name` | string | ✗ | Custom repository name |
| `description` | string | ✗ | Repository description |

## Validation Rules

- URLs must match GitHub repository pattern
- Category and subcategory names cannot be empty
- Subcategories must contain at least one repository
- Root object must contain at least one category

## Examples

See `examples/awesome-repositories/` folder for complete usage examples. 