.PHONY: docs

help:
	@echo "test - run tests"
	@echo "coverage - generate a coverage HTML report and open it"
	@echo "docs - generate Sphinx HTML documentation and open it"
	@echo "bundles - create Webpack bundles"
	@echo "dev - run application for development"
	@echo "prod - run application for production"

test:
	python manage.py test

coverage:
	coverage run --source='.' manage.py test
	coverage html
	xdg-open htmlcov/index.html

docs:
	cd docs && make html
	xdg-open docs/build/html/index.html

bundles:
	cd static && npm run build

dev:
	docker compose -f ./docker/docker-compose-dev.yml up -d

prod:
	docker compose -f ./docker/docker-compose.yml up -d --build
