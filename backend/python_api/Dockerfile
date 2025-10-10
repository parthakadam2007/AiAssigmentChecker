FROM python:3.13

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install -r /code/requirements.txt

# Install OpenCV system dependencies
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY ./ /code/app
ENV PYTHONPATH=/code/app
CMD ["fastapi", "dev", "/code/app/main.py", "--host", "0.0.0.0", "--port", "8000"]

# # Use official Python image
# FROM python:3.13

# # Set the working directory to /code
# WORKDIR /code

# # Copy requirements first (for caching)
# COPY ./requirements.txt /code/requirements.txt

# # Install dependencies
# RUN pip install --no-cache-dir -r /code/requirements.txt

# # Install OpenCV dependencies
# RUN apt-get update && apt-get install -y \
#     libgl1 \
#     libglib2.0-0 \
#     && rm -rf /var/lib/apt/lists/*

# # Copy app source code
# COPY ./app /code/app

# # Set PYTHONPATH so imports like `from app.models import ...` work
# ENV PYTHONPATH=/code

# # Expose FastAPI port
# EXPOSE 8000

# # Start FastAPI using uvicorn
# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]