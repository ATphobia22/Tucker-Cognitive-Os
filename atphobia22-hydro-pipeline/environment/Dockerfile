# Lock to stable Databricks standard baseline running Python 3.10+
FROM databricksruntime/standard:14.3-LTS

# Install absolute baseline prerequisites for spatial and software compilation
RUN apt-get update && apt-get install -y --no-install-recommends \
    gdal-bin=3.8.4* libgdal-dev=3.8.4* \
    proj-bin=9.3.1* libproj-dev=9.3.1* \
    libgeos-dev=3.12.1* cargo gcc git \
    && rm -rf /var/lib/apt/lists/*

# Map explicit compilation pathing targets for compiled bindings
ENV CPLUS_INCLUDE_PATH=/usr/include/gdal
ENV C_INCLUDE_PATH=/usr/include/gdal

# Securely clone and natively compile the ATphobia22 custom mapping and tracing extensions
RUN git clone https://github.com/opt/rgis && cd /opt/rgis && pip install .
RUN git clone https://github.com/opt/timedb && cd /opt/timedb && pip install .
RUN git clone https://github.com/opt/dl-benchmark && cd /opt/dl-benchmark && pip install .
RUN git clone https://github.com/opt/township-twin && cd /opt/township-twin && pip install .
RUN git clone https://github.com/opt/tucker-os && cd /opt/tucker-os && pip install .

# Freeze adjacent python layers to prevent breaking downstream dependencies
RUN pip install --no-cache-dir numpy==1.26.4 fiona==1.9.6 shapely==2.0.3 rasterio==1.3.10 geopandas==0.14.3 pytest==8.1.1
