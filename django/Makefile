.PHONY: docs

help:
	@echo "test - run tests"
	@echo "coverage - generate a coverage HTML report and open it"
	@echo "docs - generate Sphinx HTML documentation and open it"
	@echo "deploy - deploy the app using Ansible"
	@echo "bundles - create Webpack bundles"

test:
	python manage.py test

coverage:
	coverage run --source='.' manage.py test
	coverage html
	xdg-open htmlcov/index.html

docs:
	cd docs && make html
	xdg-open docs/build/html/index.html

deploy:
	ansible-playbook ansible/playbook.yml --inventory=ansible/inventory.yml

bundles:
	cd webpack && npm run build
	cd ..
