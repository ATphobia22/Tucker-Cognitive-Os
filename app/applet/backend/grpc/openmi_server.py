import asyncio
import grpc
import logging
from concurrent import futures
from grpc import StatusCode

logger = logging.getLogger("ptdt.grpc")

class GrpcExceptionInterceptor(grpc.aio.ServerInterceptor):
    async def intercept_service(self, continuation, handler_call_details):
        handler = await continuation(handler_call_details)
        if handler is None:
            return handler
            
        original = handler.unary_unary
        
        async def intercepted(request, context):
            try:
                return await original(request, context)
            except Exception as e:
                logger.error(f"gRPC error in {handler_call_details.method}: {str(e)}", exc_info=True)
                await context.abort(StatusCode.INTERNAL, str(e))
                
        return grpc.unary_unary_rpc_method_handler(
            intercepted,
            request_deserializer=handler.request_deserializer,
            response_serializer=handler.response_serializer
        )

async def serve():
    server = grpc.aio.server(
        futures.ThreadPoolExecutor(max_workers=10),
        interceptors=[GrpcExceptionInterceptor()]
    )
    server.add_insecure_port('[::]:50051')
    await server.start()
    logger.info("   OpenMI gRPC server running on port 50051")
    await server.wait_for_termination()

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    asyncio.run(serve())
