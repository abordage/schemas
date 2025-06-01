# Schemas

Collection of JSON schemas for validating configuration files and data structures.

## Project Structure

```
schemas/
├── schemas/                    # JSON schemas
│   └── awesome-repositories/
│       └── awesome-repositories.schema.json
├── examples/                   # Usage examples
│   └── awesome-repositories/
│       ├── valid-example.yaml
│       └── invalid-example.yaml
├── docs/                      # Schema documentation
│   └── awesome-repositories.md
└── README.md
```

## Available Schemas

### Awesome Repositories Schema
- **File**: `schemas/awesome-repositories/awesome-repositories.schema.json`
- **Purpose**: Validation of repository catalogs with categories and subcategories
- **Documentation**: [docs/awesome-repositories.md](docs/awesome-repositories.md)
- **Examples**: [examples/awesome-repositories/](examples/awesome-repositories/)

## Usage

### Editor Integration

Add to the beginning of your YAML file:

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/abordage/schemas/main/schemas/awesome-repositories/awesome-repositories.schema.json
```

### CI/CD Integration

Use the [schema-validation-action](https://github.com/marketplace/actions/schema-validation-action) for automated validation:

```yaml
# GitHub Actions example
- name: Validate awesome repositories
  uses: cardinalby/schema-validator-action@v3
  with:
    file: 'config/repositories.yaml'
    schema: 'https://raw.githubusercontent.com/abordage/schemas/main/schemas/awesome-repositories/awesome-repositories.schema.json'
```

You can also validate multiple files at once:

```yaml
- name: Validate all repository configs
  uses: cardinalby/schema-validator-action@v3
  with:
    file: 'configs/*.yaml'
    schema: 'https://raw.githubusercontent.com/abordage/schemas/main/schemas/awesome-repositories/awesome-repositories.schema.json'
```

## Adding New Schemas

1. Create schema in `schemas/{schema-name}/` folder
2. Add examples to `examples/{schema-name}/`
3. Create documentation in `docs/{schema-name}.md`
4. Update this README

## TODO

- [ ] Submit awesome-repositories schema to [SchemaStore](https://github.com/SchemaStore/schemastore) for wider community access

## License

[MIT License](LICENSE)
