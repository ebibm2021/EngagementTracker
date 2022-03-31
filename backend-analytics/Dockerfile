FROM python:3

ENV PYTHONUNBUFFERED=0

WORKDIR /app
COPY * /app

RUN pip install -r requirements.txt

EXPOSE 5010
ENTRYPOINT [ "python" ]

CMD [ "app.py" ]