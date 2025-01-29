run_api:
	cd backend && pipenv run gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 --reload

run_web:
	cd frontend && npm run dev

install_backend:
	cd backend && pipenv install

install_frontend:
	cd frontend && npm install
