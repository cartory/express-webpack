  select id,name, st_flipcoordinates(
                   
                    
                    ST_LineLocatePoint(
                    st_transform(geom,900913),
                    st_transform(st_flipcoordinates(
                    st_geomFromText('POINT(${req.body.lat} ${req.body.lng})', 4326)),900913))  
                    ) as geom from ruta
                        where st_distance(
                        st_transform(st_flipcoordinates(st_geomFromText('POINT(${req.body.lat} ${req.body.lng})', 4326)),900913),
                        st_transform(geom	,900913)
                        ) <= 300 ;