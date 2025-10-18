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